# Premium UI Design Guidelines

This document defines the design system for the MyPlanForSuccess business plan application. These patterns were established in Section 1 and should be applied consistently across all sections.

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Navy Dark | `#1a2744` | Headers, badges, focus states, primary buttons, hero backgrounds |
| Navy Light | `#2d3e5f` | Gradients, hover states, secondary elements |
| Light Blue | `#e8f4f8` | Backgrounds, gradient start, table row alternation, info boxes |
| White | `#ffffff` | Content areas, cards, input backgrounds |

### Text Colors

| Name | Hex | Usage |
|------|-----|-------|
| Slate 900 | `#0f172a` | Primary headings, emphasis text |
| Slate 800 | `#1e293b` | Question labels, card titles |
| Slate 700 | `#334155` | Body text, input text, completed badge backgrounds |
| Slate 600 | `#475569` | Subtitles, descriptions |
| Slate 500 | `#64748b` | Secondary text, hints |
| Slate 400 | `#94a3b8` | Placeholders, disabled text, word counts |
| Slate 300 | `#cbd5e1` | Borders (inactive) |
| Slate 200 | `#e2e8f0` | Light borders, dividers |
| Slate 100 | `#f1f5f9` | Card borders, subtle backgrounds |

### Status Colors

**IMPORTANT: No green completion states**

| State | Color | Notes |
|-------|-------|-------|
| Empty/Default | `bg-slate-200 text-slate-600` | Unfilled badges |
| Focused | `bg-[#1a2744] text-white` | Active input state |
| Complete | `bg-slate-700 text-white` | Filled/complete indicators |

❌ **DO NOT USE:** `emerald`, `green`, or any green-based colors for completion states

---

## Components

### StepContainer

Wraps each step page with consistent background and layout.

```tsx
import { StepContainer } from "@/components/business-plan/ui";

<StepContainer>
  {/* Step content */}
</StepContainer>
```

**Styling:**
- Full height: `min-h-screen`
- Gradient background: `bg-gradient-to-b from-[#e8f4f8]/30 via-white to-white`
- Animation: `animate-in fade-in slide-in-from-bottom-4 duration-500`
- Content wrapper: `max-w-2xl mx-auto px-4 py-8 md:px-6 md:py-12`

**Props:**
- `className?: string` - Additional classes (e.g., `className="max-w-4xl"` for wider content)

---

### StepHeader

Premium header for step introduction with badge, title highlighting, and decorative icon.

```tsx
import { StepHeader } from "@/components/business-plan/ui";
import { Sparkles } from "lucide-react";

<StepHeader
  part="Part 4A"
  title="Motivating Affirmations"
  highlightWord="Affirmations"
  subtitle="Choose 3-5 affirmations that reinforce who you are becoming in 2026."
  icon={Sparkles}
/>
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `part` | `string` | Badge text (e.g., "Part 4A", "Section 1B") |
| `title` | `string` | Main heading |
| `highlightWord` | `string?` | Word to underline with light blue highlight |
| `subtitle` | `string` | Description text |
| `icon` | `LucideIcon?` | Decorative icon (hidden on mobile) |

**Badge styling:** `bg-[#1a2744] text-white rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest`

**Title highlight:** Light blue underline effect using `bg-[#e8f4f8]`

---

### UpNextFooter

Teaser footer showing what comes next.

```tsx
import { UpNextFooter } from "@/components/business-plan/ui";

<UpNextFooter text="Define your grounding rituals" />
```

**Styling:**
- Container: `mt-12 rounded-2xl bg-gradient-to-r from-[#e8f4f8] to-white p-6 text-center`
- Label: `text-sm font-medium text-slate-500`
- Text: `text-lg font-semibold text-[#1a2744]` with arrow suffix

---

### PremiumTextarea

Store-agnostic textarea with auto-resize, word count, and numbered badge.

```tsx
import { PremiumTextarea } from "@/components/business-plan/ui";

<PremiumTextarea
  number={1}
  label="What went well last year?"
  placeholder="Describe your wins..."
  value={value}
  onChange={(val) => setValue(val)}
  minHeight={120}
  maxHeight={300}
  showWordCount={true}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Question/field label |
| `value` | `string` | required | Current value |
| `onChange` | `(value: string) => void` | required | Change handler |
| `placeholder` | `string?` | - | Placeholder text |
| `number` | `number?` | - | Badge number (shows checkmark when filled) |
| `showWordCount` | `boolean` | `true` | Show word count below |
| `minHeight` | `number` | `120` | Minimum height in px |
| `maxHeight` | `number` | `300` | Maximum height before scrolling |

**Card styling:**
```
rounded-3xl border-2 bg-white p-6 transition-all duration-300
Unfocused: border-slate-100 hover:border-slate-200 hover:shadow-md
Focused: border-[#1a2744] shadow-xl shadow-[#1a2744]/5
```

**Badge states:**
- Empty: `bg-slate-200 text-slate-600`
- Focused: `bg-[#1a2744] text-white`
- Complete: `bg-slate-700 text-white` + checkmark icon

---

### PremiumInput

Store-agnostic input with underline style and completion indicator.

```tsx
import { PremiumInput } from "@/components/business-plan/ui";

<PremiumInput
  number={1}
  label="Affirmation 1"
  placeholder="I am..."
  value={value}
  onChange={(val) => setValue(val)}
  type="text"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Field label |
| `value` | `string \| number \| null` | required | Current value |
| `onChange` | `(value: string \| number \| null) => void` | required | Change handler |
| `placeholder` | `string?` | - | Placeholder text |
| `type` | `"text" \| "number" \| "date"` | `"text"` | Input type |
| `prefix` | `string?` | - | Prefix (e.g., "$") |
| `number` | `number?` | - | Optional badge number |
| `defaultToToday` | `boolean` | `false` | Auto-fill today's date |

**Input styling:**
```
border-b-2 bg-transparent py-3 text-lg font-medium
Unfilled: border-slate-200 focus:border-[#1a2744]
Filled: border-slate-400
```

---

### DarrylTip

Navy card for tips/advice from Darryl.

```tsx
import { DarrylTip } from "@/components/business-plan/ui";

<DarrylTip
  tip="Your affirmations work best when you read them aloud each morning."
  className="mb-8"
/>
```

**Styling:**
- Navy background with gradient overlay
- Rounded corners: `rounded-2xl`
- Icon + text layout

---

## Layout Patterns

### Card Containers

**Standard card:**
```
rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-sm
```

**Highlighted card (hover):**
```
hover:border-slate-200 hover:shadow-md
```

**Active/focused card:**
```
border-[#1a2744] shadow-xl shadow-[#1a2744]/5
```

### Section Headers in Forms

```tsx
<h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
  My 2026 Affirmations
</h3>
```

### Info/Hint Boxes

```tsx
<div className="rounded-2xl border-2 border-slate-100 bg-[#e8f4f8]/30 p-6">
  {/* Content */}
</div>
```

### Numbered Badges (in lists)

```tsx
<span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a2744] text-sm font-bold text-white">
  1
</span>
```

---

## Step Page Structure

Every step should follow this structure:

```tsx
export function StepExample() {
  return (
    <StepContainer>
      {/* 1. Header */}
      <StepHeader
        part="Part XA"
        title="Step Title"
        highlightWord="Title"
        subtitle="Brief description of what this step is about."
        icon={IconComponent}
      />

      {/* 2. Darryl Tip (optional) */}
      <DarrylTip
        tip="Helpful advice for this step."
        className="mb-8"
      />

      {/* 3. Instructional content (optional) */}
      <div className="mb-8 rounded-2xl border-2 border-slate-100 bg-[#e8f4f8]/30 p-6">
        {/* How-to instructions, examples, etc. */}
      </div>

      {/* 4. Form fields */}
      <div className="space-y-6">
        {/* PremiumTextarea, PremiumInput, etc. */}
      </div>

      {/* 5. Footer */}
      <UpNextFooter text="Next step description" />
    </StepContainer>
  );
}
```

---

## Completion States

### Individual Fields

**Textarea/Input badges:**
- Show number when empty
- Show checkmark when filled
- NO color change on completion (keep slate tones)

**Input borders:**
- Empty: `border-slate-200`
- Focused: `border-[#1a2744]`
- Filled: `border-slate-400`

### Step Complete Pages

**Hero section:**
```tsx
<div className="rounded-3xl bg-[#1a2744] p-8 text-center text-white shadow-xl md:p-12">
```

**Summary checkmarks:**
```tsx
<div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700">
  <Check className="h-3 w-3 text-white" strokeWidth={3} />
</div>
```

**Celebration box:**
```tsx
<div className="rounded-2xl border-2 border-[#1a2744]/20 bg-[#e8f4f8]/30 p-6">
```

---

## Tables & Grids

### Project Matrix / Data Tables

**Header row:**
```
bg-[#1a2744] text-white
```

**Alternating rows:**
```
Even: bg-white
Odd: bg-[#e8f4f8]/30
```

**Borders:**
```
border-2 border-slate-100 rounded-2xl
```

**Cell focus:**
```
bg-[#e8f4f8]/50
```

**Filled indicator (left border):**
```
border-l-2 border-l-slate-400
```

---

## Responsive Behavior

### Mobile (default)
- Single column layouts
- Decorative icons hidden
- Full-width cards
- Save indicator hidden

### Desktop (md: and up)
- Multi-column grids where appropriate
- Decorative icons visible in headers
- Max-width containers centered
- Save indicator visible

---

## Animation

### Page transitions
```
animate-in fade-in slide-in-from-bottom-4 duration-500
```

### Card interactions
```
transition-all duration-300
```

### Badge color transitions
```
transition-colors duration-300
```

---

## Files Reference

### Shared UI Components
```
src/components/business-plan/ui/
├── index.ts              # Exports all shared components
├── darryl-tip.tsx        # DarrylTip component
├── step-container.tsx    # StepContainer component
├── step-header.tsx       # StepHeader component
├── up-next-footer.tsx    # UpNextFooter component
├── premium-textarea.tsx  # PremiumTextarea component
└── premium-input.tsx     # PremiumInput component
```

### Section 1 Components (original)
```
src/components/business-plan/section-one/ui/
├── workbook-textarea.tsx  # Store-coupled version (Section 1 only)
├── workbook-input.tsx     # Store-coupled version (Section 1 only)
├── step-container.tsx     # Original (keep for Section 1)
├── step-header.tsx        # Original (keep for Section 1)
└── up-next-footer.tsx     # Original (keep for Section 1)
```

---

## Checklist for New Steps

- [ ] Import from `@/components/business-plan/ui`
- [ ] Wrap in `StepContainer`
- [ ] Use `StepHeader` with appropriate icon
- [ ] Add `DarrylTip` if helpful
- [ ] Use `PremiumTextarea` / `PremiumInput` for form fields
- [ ] Add numbered badges where appropriate
- [ ] End with `UpNextFooter`
- [ ] NO green/emerald colors
- [ ] Test responsive behavior
