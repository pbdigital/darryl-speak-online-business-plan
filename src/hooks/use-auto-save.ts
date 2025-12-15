'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { savePlanSection, SectionKey } from '@/lib/api';
import { useBusinessPlan } from '@/providers/business-plan-provider';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AutoSaveState {
  status: SaveStatus;
  lastSavedAt: Date | null;
  error: string | null;
}

interface UseAutoSaveOptions {
  /** Debounce delay in milliseconds (default: 2000) */
  debounceMs?: number;
  /** Callback when save starts */
  onSaveStart?: () => void;
  /** Callback when save succeeds */
  onSaveSuccess?: () => void;
  /** Callback when save fails */
  onSaveError?: (error: string) => void;
}

interface UseAutoSaveReturn extends AutoSaveState {
  /** Trigger an immediate save (e.g., on navigation) */
  saveNow: () => Promise<void>;
  /** Whether a save is currently in progress */
  isSaving: boolean;
}

/**
 * Hook to auto-save section data to Supabase with debouncing
 *
 * @param sectionKey - The section key (reflection, swot, etc.)
 * @param getData - Function that returns the current section data to save
 * @param isDirty - Whether the data has changed since last save
 * @param markSaved - Function to mark the store as saved (clears isDirty)
 * @param options - Additional options
 */
export function useAutoSave<T extends object>(
  sectionKey: SectionKey,
  getData: () => T,
  isDirty: boolean,
  markSaved: () => void,
  options: UseAutoSaveOptions = {}
): UseAutoSaveReturn {
  const { debounceMs = 2000, onSaveStart, onSaveSuccess, onSaveError } = options;
  const { plan } = useBusinessPlan();

  const [state, setState] = useState<AutoSaveState>({
    status: 'idle',
    lastSavedAt: null,
    error: null,
  });

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isSaving = useRef(false);
  const pendingSave = useRef(false);

  // Stable reference to getData to avoid re-renders
  const getDataRef = useRef(getData);
  getDataRef.current = getData;

  const save = useCallback(async () => {
    if (!plan?.id) {
      console.warn('Cannot save: no business plan loaded');
      return;
    }

    // If already saving, mark as pending
    if (isSaving.current) {
      pendingSave.current = true;
      return;
    }

    isSaving.current = true;
    setState((s) => ({ ...s, status: 'saving', error: null }));
    onSaveStart?.();

    try {
      const data = getDataRef.current() as Record<string, unknown>;
      const result = await savePlanSection(plan.id, sectionKey, data);

      if (!result.success) {
        throw new Error(result.errors?.[0]?.message || 'Save failed');
      }

      setState({
        status: 'saved',
        lastSavedAt: new Date(),
        error: null,
      });
      markSaved();
      onSaveSuccess?.();

      // Reset to idle after showing "saved" briefly
      setTimeout(() => {
        setState((s) => (s.status === 'saved' ? { ...s, status: 'idle' } : s));
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Save failed';
      setState((s) => ({ ...s, status: 'error', error: errorMessage }));
      toast.error('Failed to save', { description: errorMessage });
      onSaveError?.(errorMessage);
    } finally {
      isSaving.current = false;

      // If there was a pending save, trigger it now
      if (pendingSave.current) {
        pendingSave.current = false;
        save();
      }
    }
  }, [plan?.id, sectionKey, markSaved, onSaveStart, onSaveSuccess, onSaveError]);

  // Save immediately (for navigation)
  const saveNow = useCallback(async () => {
    // Clear any pending debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }

    if (isDirty) {
      await save();
    }
  }, [isDirty, save]);

  // Debounced save when dirty changes
  useEffect(() => {
    if (!isDirty || !plan?.id) return;

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new debounce timer
    debounceTimer.current = setTimeout(() => {
      save();
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [isDirty, debounceMs, save, plan?.id]);

  // Save on unmount if dirty (fire and forget)
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // If dirty and plan exists, try to save
      // Note: This is a best-effort save on unmount
      if (plan?.id) {
        const data = getDataRef.current() as Record<string, unknown>;
        savePlanSection(plan.id, sectionKey, data).catch((err) => {
          console.error('Failed to save on unmount:', err);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...state,
    saveNow,
    isSaving: state.status === 'saving',
  };
}
