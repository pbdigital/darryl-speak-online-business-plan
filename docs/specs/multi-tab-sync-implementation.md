# Multi-Tab Data Synchronization - Implementation Plan

## Problem Statement

When users have multiple browser tabs open viewing the same business plan section, data can be lost due to race conditions and lack of synchronization. The "last write wins" behavior causes one tab's changes to overwrite another's without any conflict detection.

### Root Causes Identified

1. **No cross-tab store synchronization** - Each tab's Zustand store is isolated
2. **Stale provider data** - `BusinessPlanProvider` loads once, never refetches
3. **Last-write-wins on server** - Edge Function upserts without version checking
4. **No localStorage event listeners** - Stores don't detect changes from other tabs
5. **Hydration reads stale data** - `useHydrateSection` reads from provider cache once

### Data Loss Scenario

```
Time   Tab A                              Tab B
─────────────────────────────────────────────────────────────
t=0    Opens Section 1
       Provider loads {X: "a", Y: "b"}
       Store hydrates with v1

t=1                                       Opens Section 1
                                          Shares same provider (stale data)
                                          Store hydrates with {X: "a", Y: "b"}

t=2    User types X = "abc"
       Store: {X: "abc", Y: "b"}          Store still has: {X: "a", Y: "b"}

t=4    Auto-save → Server                 User types Y = "xyz"
       Server: {X: "abc", Y: "b"} ✓       Store: {X: "a", Y: "xyz"}

t=5                                       Auto-save → Server
                                          Server: {X: "a", Y: "xyz"}
                                          ↑ X REVERTED - DATA LOST!
```

---

## Solution Overview

Implement **Optimistic Concurrency Control (OCC)** on the server combined with **Cross-Tab Synchronization** on the client. This two-pronged approach ensures:

1. Server rejects stale writes (prevents data loss)
2. Client tabs stay synchronized (prevents conflicts from occurring)

---

## Implementation Plan

### Phase 1: Database Schema Update

**File:** `supabase/migrations/[timestamp]_add_version_to_plan_sections.sql`

Add a `version` column to the `plan_sections` table for optimistic concurrency control.

```sql
-- Add version column for optimistic concurrency control
ALTER TABLE plan_sections
ADD COLUMN version INTEGER NOT NULL DEFAULT 1;

-- Create function to auto-increment version on update
CREATE OR REPLACE FUNCTION increment_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-increment version
CREATE TRIGGER plan_sections_version_trigger
BEFORE UPDATE ON plan_sections
FOR EACH ROW
EXECUTE FUNCTION increment_version();
```

**Acceptance Criteria:**
- [ ] Migration runs successfully
- [ ] Existing records have version = 1
- [ ] Version auto-increments on every update

---

### Phase 2: Edge Function - Version Checking

**File:** `supabase/functions/plan-sections/index.ts`

Modify the PUT handler to check version before updating.

#### Current Implementation (lines 181-195):
```typescript
const { data: section, error: upsertError } = await supabase
  .from('plan_sections')
  .upsert(
    {
      business_plan_id: planId,
      section_key: sectionKey,
      data,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'business_plan_id,section_key' }
  )
  .select()
  .single();
```

#### New Implementation:

```typescript
// Extract version from request body
const { data, version } = body;

// If version provided, check for conflicts before updating
if (version !== undefined) {
  // First, get current version from database
  const { data: currentSection, error: fetchError } = await supabase
    .from('plan_sections')
    .select('version')
    .eq('business_plan_id', planId)
    .eq('section_key', sectionKey)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // PGRST116 = not found (new record)
    return Response.json(
      { success: false, errors: [{ message: 'Failed to check version' }] },
      { status: 500 }
    );
  }

  // If record exists and versions don't match, reject the update
  if (currentSection && currentSection.version !== version) {
    return Response.json(
      {
        success: false,
        error: 'VERSION_CONFLICT',
        message: 'Data has been modified by another session. Please refresh and try again.',
        serverVersion: currentSection.version,
        clientVersion: version,
      },
      { status: 409 } // Conflict
    );
  }
}

// Proceed with upsert (version will auto-increment via trigger)
const { data: section, error: upsertError } = await supabase
  .from('plan_sections')
  .upsert(
    {
      business_plan_id: planId,
      section_key: sectionKey,
      data,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'business_plan_id,section_key' }
  )
  .select('*, version')
  .single();
```

**Acceptance Criteria:**
- [ ] PUT requests with matching version succeed
- [ ] PUT requests with stale version return 409 Conflict
- [ ] Response includes new version number after successful save
- [ ] New records (no existing version) work correctly

---

### Phase 3: Client Types Update

**File:** `src/types/business-plan.ts`

Add version to the section types.

```typescript
export interface PlanSection {
  id: string;
  business_plan_id: string;
  section_key: SectionKey;
  data: Record<string, unknown>;
  version: number; // Add this
  updated_at: string;
  created_at: string;
}

export interface SaveSectionResponse {
  success: boolean;
  data?: PlanSection;
  error?: 'VERSION_CONFLICT' | string;
  message?: string;
  serverVersion?: number;
  clientVersion?: number;
}
```

---

### Phase 4: Zustand Store Updates

**Files:**
- `src/stores/section-one-store.ts`
- `src/stores/section-two-store.ts`
- `src/stores/section-three-store.ts`
- `src/stores/section-four-store.ts`
- `src/stores/section-five-store.ts`

#### 4.1 Add Version Tracking

Add `serverVersion` to each store's state:

```typescript
interface SectionOneState {
  // ... existing fields
  serverVersion: number | null;
  setServerVersion: (version: number) => void;
}

// In the store creation:
serverVersion: null,
setServerVersion: (version) => set({ serverVersion: version }),
```

#### 4.2 Add Cross-Tab Synchronization

Add storage event listener for cross-tab sync. Create a shared utility:

**File:** `src/lib/cross-tab-sync.ts`

```typescript
import { StoreApi } from 'zustand';

/**
 * Sets up cross-tab synchronization for a Zustand store using localStorage events.
 * When another tab updates localStorage, this tab's store will be updated.
 */
export function setupCrossTabSync<T>(
  store: StoreApi<T>,
  storageKey: string,
  onSync?: (newState: Partial<T>) => void
) {
  if (typeof window === 'undefined') return () => {};

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key !== storageKey || !event.newValue) return;

    try {
      const parsed = JSON.parse(event.newValue);
      const newState = parsed.state;

      if (newState) {
        // Update the store with the new state from another tab
        store.setState(newState, true);
        onSync?.(newState);
      }
    } catch (error) {
      console.error('Cross-tab sync error:', error);
    }
  };

  window.addEventListener('storage', handleStorageChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}
```

#### 4.3 Initialize Cross-Tab Sync in Stores

In each section store, add the sync setup:

```typescript
// At the end of the store file, outside the create() call
if (typeof window !== 'undefined') {
  setupCrossTabSync(
    useSectionOneStore,
    'myplanforsuccess:section-one',
    (newState) => {
      console.log('[Section 1] Synced from another tab');
    }
  );
}
```

**Acceptance Criteria:**
- [ ] Each store tracks `serverVersion`
- [ ] Cross-tab sync utility created
- [ ] All 5 section stores have cross-tab sync enabled
- [ ] Changes in Tab A reflect in Tab B within 100ms

---

### Phase 5: Auto-Save Hook Update

**File:** `src/hooks/use-auto-save.ts`

Update to send version and handle conflicts.

#### Current save function (approx lines 67-117):

Modify to:
1. Include version in the request
2. Handle 409 Conflict responses
3. Update store with new version on success

```typescript
const save = useCallback(async () => {
  if (!planId || !isDirty) return;

  setIsSaving(true);
  setError(null);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/plan-sections/${sectionKey}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          planId,
          data: getData(),
          version: getServerVersion(), // Include current version
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 409 && result.error === 'VERSION_CONFLICT') {
        // Handle version conflict
        setError('conflict');
        onConflict?.(result); // Callback to handle conflict in UI
        return;
      }
      throw new Error(result.message || 'Failed to save');
    }

    // Update store with new version from server
    if (result.data?.version) {
      setServerVersion(result.data.version);
    }

    setIsDirty(false);
    setLastSaved(new Date());
    onSaveSuccess?.(result.data);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Save failed');
    onSaveError?.(err);
  } finally {
    setIsSaving(false);
  }
}, [planId, isDirty, getData, getServerVersion, setServerVersion, sectionKey, session]);
```

**Acceptance Criteria:**
- [ ] Version sent with every save request
- [ ] 409 responses handled gracefully
- [ ] Store version updated after successful save
- [ ] `onConflict` callback available for UI handling

---

### Phase 6: Conflict Resolution UI

**File:** `src/components/business-plan/conflict-dialog.tsx` (new file)

Create a dialog to handle version conflicts:

```typescript
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConflictDialogProps {
  open: boolean;
  onRefresh: () => void;
  onOverwrite: () => void;
  onCancel: () => void;
}

export function ConflictDialog({
  open,
  onRefresh,
  onOverwrite,
  onCancel,
}: ConflictDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Changes Detected</AlertDialogTitle>
          <AlertDialogDescription>
            This section has been updated in another browser tab or device.
            Your recent changes may conflict with those updates.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onRefresh} variant="outline">
            Refresh (Load Latest)
          </AlertDialogAction>
          <AlertDialogAction onClick={onOverwrite} variant="destructive">
            Overwrite (Keep Mine)
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

**Acceptance Criteria:**
- [ ] Dialog appears when conflict detected
- [ ] "Refresh" loads latest data from server
- [ ] "Overwrite" forces save with latest version
- [ ] "Cancel" dismisses dialog, keeps local changes unsaved

---

### Phase 7: Hydration Hook Update

**File:** `src/hooks/use-hydrate-section.ts`

Update to store the server version when hydrating:

```typescript
useEffect(() => {
  if (isLoading || hasHydrated.current) return;

  const section = sections[sectionKey];

  if (section?.data) {
    hydrateStore(section.data as Partial<T>);

    // Store the server version for conflict detection
    if (section.version) {
      setServerVersion(section.version);
    }
  }

  hasHydrated.current = true;
}, [isLoading, sections, sectionKey, hydrateStore, setServerVersion]);
```

**Acceptance Criteria:**
- [ ] Server version stored on initial hydration
- [ ] Version available for subsequent saves

---

### Phase 8: Provider Update - Include Version in Response

**File:** `src/providers/business-plan-provider.tsx`

Ensure the sections loaded include the version field:

```typescript
// In loadPlan function, ensure version is selected
const { data: sectionsData } = await supabase
  .from('plan_sections')
  .select('*, version') // Ensure version is included
  .eq('business_plan_id', plan.id);
```

---

## Testing Plan

### Unit Tests

1. **Edge Function Tests:**
   - Test version check passes with matching version
   - Test 409 returned with stale version
   - Test new records (no version) work correctly

2. **Store Tests:**
   - Test serverVersion is tracked
   - Test cross-tab sync updates state

3. **Hook Tests:**
   - Test auto-save includes version
   - Test conflict callback is called on 409

### Integration Tests

1. **Happy Path:**
   - Open section in Tab A
   - Make changes, verify save succeeds
   - Open same section in Tab B
   - Tab B should see Tab A's changes

2. **Conflict Scenario:**
   - Open section in Tab A and Tab B
   - Make changes in Tab A, wait for save
   - Make changes in Tab B (before sync)
   - Tab B should see conflict dialog

3. **Cross-Tab Sync:**
   - Open section in Tab A and Tab B
   - Make changes in Tab A
   - Tab B should update automatically (no conflict)

### Manual Test Cases

From MYP-20 test scenarios:
- [ ] Two tabs open simultaneously - last write wins, no data corruption
- [ ] Close browser during debounce window - data saved to localStorage
- [ ] Save → load cycle preserves all field values exactly

---

## Rollback Plan

If issues are discovered:

1. **Database:** Migration adds a column, doesn't modify existing data. Rollback: `ALTER TABLE plan_sections DROP COLUMN version;`

2. **Edge Function:** Can be reverted to previous version in Supabase dashboard

3. **Client:** Feature flagged - can disable version checking client-side

---

## Files Changed Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `supabase/migrations/[ts]_add_version.sql` | New | Add version column |
| `supabase/functions/plan-sections/index.ts` | Modify | Add version checking |
| `src/types/business-plan.ts` | Modify | Add version to types |
| `src/lib/cross-tab-sync.ts` | New | Cross-tab sync utility |
| `src/stores/section-one-store.ts` | Modify | Add version tracking + sync |
| `src/stores/section-two-store.ts` | Modify | Add version tracking + sync |
| `src/stores/section-three-store.ts` | Modify | Add version tracking + sync |
| `src/stores/section-four-store.ts` | Modify | Add version tracking + sync |
| `src/stores/section-five-store.ts` | Modify | Add version tracking + sync |
| `src/hooks/use-auto-save.ts` | Modify | Send version, handle conflicts |
| `src/hooks/use-hydrate-section.ts` | Modify | Store version on hydration |
| `src/components/business-plan/conflict-dialog.tsx` | New | Conflict resolution UI |
| `src/providers/business-plan-provider.tsx` | Modify | Include version in query |

---

## Estimated Effort

| Phase | Estimate |
|-------|----------|
| Phase 1: Database Migration | 0.5 hours |
| Phase 2: Edge Function | 1.5 hours |
| Phase 3: Types | 0.5 hours |
| Phase 4: Store Updates | 2 hours |
| Phase 5: Auto-Save Hook | 1.5 hours |
| Phase 6: Conflict UI | 1 hour |
| Phase 7: Hydration Hook | 0.5 hours |
| Phase 8: Provider Update | 0.5 hours |
| Testing | 2 hours |
| **Total** | **10 hours** |

---

## References

- Linear Ticket: MYP-20 (Testing & Edge Cases - where issue was discovered)
- Related Commit: 87554eb (hydration fix - symptom, not root cause)
- Test Data: `docs/testing/section-1-reflection-test-data.md`
