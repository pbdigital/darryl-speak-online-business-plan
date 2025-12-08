# DS-35: Section One UX Warm-Up Layer - Full Context

This document provides complete context for implementing DS-35. Read this before starting work.

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Current Implementation](#current-implementation)
3. [Research Findings](#research-findings)
4. [Proposed Solution](#proposed-solution)
5. [Constraints](#constraints)
6. [Detailed Feature Specs](#detailed-feature-specs)
7. [File References](#file-references)
8. [Content Requirements](#content-requirements)

---

## Problem Statement

### What users experience

Users filling out Section One (Annual Reflection & Intention Setting) report "not knowing what to type" when faced with open-ended reflection prompts. This is called **"blank page paralysis"** - the cognitive load of facing an empty textarea with a broad question.

### Why it happens

1. **Open-ended questions require multiple cognitive tasks simultaneously:** memory retrieval, emotional filtering, narrative structuring, and typing
2. **No scaffolding:** Going from empty box → finished answer is too big a leap
3. **Unclear expectations:** How much should I write? What level of detail?
4. **Target users are action-oriented:** Real estate agents are doers, not natural journalers

### What we want to achieve

Users feel guided and confident as they fill out each field. The interface helps them THINK, not just type.

---

## Current Implementation

### Section One Structure

Section One is a 10-step wizard:

| Step | Name | Content |
|------|------|---------|
| 0 | Overview | Introduction, "Start Reflection" button |
| 1 | Production Numbers | Numeric inputs + 5 reflection textareas |
| 2 | Reflection Questions | 3 textareas (achievements, challenges, learnings) |
| 3 | Gratitude | 3 textareas |
| 4 | Self-Reflection | 5 textareas (fulfillment, values, wellbeing) |
| 5 | Goals & Intentions | 6 textareas |
| 6 | Wellness | 7 textareas |
| 7 | Mantra | 4 textareas |
| 8 | Celebration | 4 textareas |
| 9 | Complete | Summary, signature |

**Total:** ~46 fields, mostly textareas

### Current UI Pattern

Each question currently shows:
- **Label:** The question in uppercase (e.g., "WHAT ARE YOUR CORE VALUES?")
- **Textarea:** With a placeholder showing an EXAMPLE answer

**Example of current placeholder:**
```
WHAT ASPECTS OF YOUR LIFE DO YOU FEEL MOST FULFILLED IN, AND WHY?

[Textarea with placeholder:]
"I feel most fulfilled in my client relationships. Helping families find
their perfect home gives me real purpose..."
```

**The problem:** These placeholders show WHAT an answer looks like, but don't help the user THINK about their OWN answer.

### Key Files

```
src/components/business-plan/section-one/
├── section-one-form.tsx          # Main wizard container
├── steps/
│   ├── step-overview.tsx         # Step 0
│   ├── step-production-numbers.tsx
│   ├── step-reflection-questions.tsx
│   ├── step-gratitude.tsx
│   ├── step-self-reflection.tsx
│   ├── step-goals-intentions.tsx
│   ├── step-wellness.tsx
│   ├── step-mantra.tsx
│   ├── step-celebration.tsx
│   └── step-complete.tsx         # Step 9
└── ui/
    ├── workbook-textarea.tsx     # Reusable textarea component
    ├── workbook-input.tsx        # Reusable input component
    ├── progress-stepper.tsx
    ├── encouragement-toast.tsx
    ├── darryl-hint.tsx           # TO BE CREATED
    └── warm-up-panel.tsx         # TO BE CREATED

src/stores/
└── section-one-store.ts          # Zustand store with all 46 fields
```

### WorkbookTextarea Component

This is the main component used for all reflection questions. Current props:

```typescript
interface WorkbookTextareaProps {
  label: string;
  fieldName?: keyof SectionOneData;
  placeholder?: string;
  rows?: number;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  showWordCount?: boolean;
}
```

Features:
- Connects to Zustand store via `fieldName`
- Shows word count when content exists
- Green checkmark + border when field has content
- Blue highlight on focus

---

## Research Findings

Full research in `.specify/research/brainstorm-section-one-ux-findings.md`

### Key Patterns from Top Apps

1. **"Warm-Up" Pattern:** Never start with text. Start with sliders, chips, or low-stakes micro-interactions. Only AFTER these easy wins, present text fields.

2. **Sentence Starters:** Pre-fill textareas with cognitive ramps like "Looking back, I feel most grateful for..." instead of example answers.

3. **Recognition > Recall:** Showing chips `[Career] [Family] [Health]` to tap (recognition) is easier than asking "What areas?" (recall).

4. **Contextual Help:** Manual-trigger hints that coach the user on HOW to think about the question.

5. **Constraint-Based Design:** "List 3 things" sets a clear finish line and reduces anxiety.

### What Top UX Designers Recommend

> "The blank page is a failure of empathy. It assumes the user has the cognitive surplus to be their own architect, editor, and secretary simultaneously."

The interface should feel like a conversation with a coach, not filling out paperwork.

---

## Proposed Solution

### Three Features

1. **Better Sentence Starters** - Change placeholders from example answers to cognitive ramps
2. **"Darryl Says" Help** - Expandable coaching tips in Darryl Davis's voice
3. **Optional Warm-Up Panel** - Chips + sliders as thinking aids (hidden by default)

### How They Work Together

```
WHAT ARE YOUR CORE VALUES, AND HOW DID YOU ALIGN WITH THEM?

┌─────────────────────────────────────────────────────────────┐
│ Looking back on this year, my core values are...            │  ← Sentence starter
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

💡 Stuck? Let Darryl help →                                      ← Help trigger

[User clicks]

┌─────────────────────────────────────────────────────────────┐
│ 🧠 Let's warm up your thinking...                           │
│                                                             │
│ Which areas resonate with you?                              │
│ [Integrity] [Family] [Growth] [Service] [Balance]           │  ← Thinking chips
│                                                             │
│ How aligned did you feel this year? (1-10)                  │
│ 😫 ─────────●───────── 😊                                   │  ← Thinking slider
│                                                             │
│ 🎯 Darryl says:                                             │
│ "Values aren't just words on a wall. Think about a moment  │
│ this year when you had to make a tough call. Did you       │  ← Darryl hint
│ choose the easy path or the right path? THAT reveals your  │
│ values. Start there."                                       │
│                                                             │
│                              [I'm ready to write]           │
└─────────────────────────────────────────────────────────────┘
```

---

## Constraints

### Client Constraints

1. **Questions come from the client's ebook** - We cannot change, remove, or add questions without approval
2. **The ebook structure must be preserved** - Section flow, question wording, etc.
3. **Darryl Davis has a specific voice** - Encouraging, direct, action-oriented, practical

### Technical Constraints

1. **Warm-up tools (chips/sliders) must NOT store data** - They are thinking aids only
2. **Original fields must remain unchanged** - Same field names, same store structure
3. **Help panel must be hidden by default** - User opts in, not forced

### What We CAN Do

- Change placeholder text (sentence starters)
- Add new UI components around existing fields
- Add collapsible/expandable helper panels
- Improve micro-interactions

---

## Detailed Feature Specs

### Feature 1: Better Sentence Starters

**What:** Replace current example-style placeholders with cognitive ramps.

**Current vs Proposed:**

| Field | Current Placeholder | Proposed Sentence Starter |
|-------|--------------------|-----------------------------|
| `gratefulFor` | "I'm grateful for the opportunity to help 12 families find their dream homes this year..." | "Looking back on this year, I'm most grateful for..." |
| `biggestStruggles` | (example of struggles) | "My biggest challenge this year was..." |
| `mostFulfilled` | "I feel most fulfilled in my client relationships..." | "I felt most fulfilled when..." |
| `coreValuesAlignment` | "My core values are integrity and family..." | "Looking back, my core values are... and I aligned with them by..." |
| `topGoalsIntentions` | "Close 30 transactions. Hire a buyer's agent..." | "My top goals for the coming year are..." |

**Implementation:**

1. Update the `placeholder` prop on each `WorkbookTextarea` in the step components
2. Sentence starters should:
   - Be incomplete sentences the user continues
   - Prompt THINKING, not show ANSWERS
   - Be deletable if user wants to start fresh

**Files to modify:**
- `src/components/business-plan/section-one/steps/step-*.tsx` (all step files)

---

### Feature 2: "Darryl Says" Contextual Help

**What:** A manual-trigger help feature that reveals coaching advice in Darryl's voice.

**UI:**

```
[After the textarea]

💡 Stuck? Let Darryl help →

[User clicks, expands to:]

┌─────────────────────────────────────────────────────────────┐
│ 🎯 Darryl says:                                             │
│                                                             │
│ "Values aren't just words on a wall. Think about a moment  │
│ this year when you had to make a tough call. Did you       │
│ choose the easy path or the right path? THAT reveals your  │
│ values. Start there."                                       │
│                                                             │
│                              [Got it, thanks]               │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:**

1. Create new component: `src/components/business-plan/section-one/ui/darryl-hint.tsx`
2. Create content map: `DARRYL_HINTS` record mapping field names to hint text
3. Add to each `WorkbookTextarea` or as a sibling component

**Component API:**

```typescript
interface DarrylHintProps {
  fieldName: string;
  className?: string;
}

// Usage
<WorkbookTextarea
  label="What are your core values?"
  fieldName="coreValuesAlignment"
  placeholder="Looking back, my core values are..."
/>
<DarrylHint fieldName="coreValuesAlignment" />
```

**Content map structure:**

```typescript
const DARRYL_HINTS: Record<string, string> = {
  gratefulFor: "Don't overthink this one. Picture yourself handing keys to a family this year. See their faces? That's your answer. Or maybe it's a mentor who picked up the phone when you needed them. Write that name down.",
  biggestStruggles: "Be honest here - this isn't about beating yourself up. Every top producer has struggled. What matters is that you can NAME it. Once you name it, you can fix it.",
  coreValuesAlignment: "Values aren't just words on a wall. Think about a moment this year when you had to make a tough call. Did you choose the easy path or the right path? THAT reveals your values. Start there.",
  // ... one per field
};
```

**Darryl's voice characteristics:**
- Direct and action-oriented
- Uses "you" frequently
- Short punchy sentences
- Practical advice, not fluffy motivation
- Often ends with a clear call-to-action ("Start there", "Write that down")

---

### Feature 3: Optional Warm-Up Panel

**What:** Chips and sliders as thinking aids, tucked inside the help panel. User opts in.

**Key principle:** These tools help users THINK but do NOT store any data. They're purely UX scaffolding.

**UI (expanded state):**

```
┌─────────────────────────────────────────────────────────────┐
│ 🧠 Let's warm up your thinking...                           │
│                                                             │
│ Which areas come to mind? (just to get you started)         │
│ [Career] [Family] [Health] [Finances] [Growth]              │
│                                                             │
│ Quick gut check - how fulfilled overall? (1-10)             │
│ 😫 ─────────●───────── 😊                                   │
│                                                             │
│ 🎯 Darryl says:                                             │
│ "Don't overthink this. What made you smile this year?      │
│ Start there."                                               │
│                                                             │
│                              [I'm ready to write]           │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:**

1. Create container component: `WarmUpPanel`
2. Create sub-components: `SelectionChips`, `ThinkingSlider`
3. Configure per-field which warm-up tools to show

**Component API:**

```typescript
interface WarmUpPanelProps {
  fieldName: string;
  chips?: string[];           // If provided, show chips
  slider?: {                  // If provided, show slider
    label: string;
    lowLabel: string;
    highLabel: string;
  };
  darrylHint: string;
  onReady?: () => void;       // Called when user clicks "I'm ready"
}
```

**Configuration per field:**

```typescript
const WARMUP_CONFIG: Record<string, WarmUpConfig> = {
  mostFulfilled: {
    chips: ["Career", "Family", "Health", "Finances", "Relationships", "Growth"],
    slider: {
      label: "How fulfilled did you feel overall this year?",
      lowLabel: "😫",
      highLabel: "😊"
    }
  },
  biggestStruggles: {
    chips: ["Market", "Lead Gen", "Time", "Work-Life Balance", "Skills", "Mindset"],
    // no slider for this one
  },
  // ... etc
};
```

**Important:** Chips and sliders do NOT save to the store. They are ephemeral UI state only.

---

## File References

### Files to CREATE

| File | Purpose |
|------|---------|
| `src/components/business-plan/section-one/ui/darryl-hint.tsx` | Expandable coaching tip component |
| `src/components/business-plan/section-one/ui/warm-up-panel.tsx` | Container for all warm-up tools |
| `src/components/business-plan/section-one/ui/selection-chips.tsx` | Multi-select thinking aid chips |
| `src/components/business-plan/section-one/ui/thinking-slider.tsx` | 1-10 rating thinking aid |
| `src/lib/content/section-one-hints.ts` | Content: Darryl hints for each field |
| `src/lib/content/section-one-warmups.ts` | Config: Warm-up tools per field |
| `src/lib/content/section-one-starters.ts` | Content: Sentence starters per field |

### Files to MODIFY

| File | Changes |
|------|---------|
| `src/components/business-plan/section-one/steps/step-*.tsx` | Update placeholders, add DarrylHint/WarmUpPanel |
| `src/components/business-plan/section-one/ui/workbook-textarea.tsx` | Possibly add integration point for help components |
| `src/components/business-plan/section-one/ui/index.ts` | Export new components |

### Files for REFERENCE (read-only)

| File | Contains |
|------|----------|
| `src/stores/section-one-store.ts` | All field names and types |
| `src/components/business-plan/section-one/section-one-form.tsx` | Wizard structure, step flow |

---

## Content Requirements

### Sentence Starters Needed

Write sentence starters for all ~30 textarea fields. Each starter should:
- Be an incomplete sentence
- Prompt the user to continue their own thought
- NOT be an example answer

### Darryl Hints Needed

Write coaching hints for all ~30 textarea fields in Darryl's voice. Each hint should:
- Be 2-4 sentences
- Give practical advice on HOW to think about the question
- End with a clear action ("Start there", "Write that down")
- Sound like Darryl Davis - direct, encouraging, practical

### Warm-Up Configs Needed

Decide which fields benefit from:
- Selection chips (and what the options are)
- Thinking sliders (and what they measure)

Not every field needs warm-up tools. Prioritize fields where users are most likely to get stuck (emotional/abstract questions).

---

## Testing Checklist

- [ ] All textareas have sentence starters (not example answers)
- [ ] "Darryl Says" expands/collapses correctly
- [ ] Warm-up panel is hidden by default
- [ ] Clicking chips does NOT save to store
- [ ] Moving slider does NOT save to store
- [ ] Help panel works on mobile (responsive)
- [ ] User can still delete sentence starter and write their own
- [ ] Word count still works correctly
- [ ] Green checkmark appears when user writes content
- [ ] Transitions/animations feel smooth

---

## Questions to Ask If Unclear

1. "What does the current placeholder say for field X?" → Check the step file
2. "What is Darryl's voice like?" → Direct, action-oriented, encouraging, practical. See examples in this doc.
3. "Should this field have chips/slider?" → Only emotional/abstract questions benefit. Check WARMUP_CONFIG.
4. "Where does this component go?" → Adjacent to WorkbookTextarea, not inside it
