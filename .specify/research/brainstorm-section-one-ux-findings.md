# Research Findings: Section One UX Improvements

Generated: 2025-12-09

## Core Problem
"Blank page paralysis" - users don't know what to type in open-ended reflection prompts.

## Key Insights

### 1. Reframe: "Consultative Agent" not "Form"
The interface should feel like a conversation with a coach, not filling out paperwork.

### 2. The "Warm-Up" Pattern
Never start with text. Start with:
- Mood/confidence sliders (1-10)
- Selection chips/tags (tap, don't type)
- Low-stakes micro-interactions

Only AFTER these easy wins, present text fields with context.

### 3. Constraint-Based Design
- **Grid layouts**: Fixed boxes, not infinite scroll
- **Rule of Three**: "List 3 things" sets a finish line
- **Time-boxing**: "2 minutes to brain dump" creates urgency and permission to stop

### 4. Sentence Starters
Pre-fill textareas with cognitive ramps:
- "I felt most accomplished this year when..."
- "My biggest challenge was..."
- "Looking ahead, I want to..."

### 5. Recognition > Recall
- **Hard**: "What were your lead sources?" (recall from memory)
- **Easy**: Show chips `Open House` `SOI` `Facebook Ads` (recognition/selection)

### 6. Voice-First / Brain Dump Mode
Let users ramble into microphone. AI structures output:
- Removes filler words
- Organizes into paragraphs
- Maps to form fields

### 7. Visual Scaffolding
Trigger memory with past data:
- "You closed 14 homes last year"
- "Your busiest month was June"
- Photos of transactions (like Spotify Wrapped)

### 8. Dynamic Routing
Ask different follow-ups based on answers:
- "Hit your goal?" → YES → "How can you scale?"
- "Hit your goal?" → NO → "What prevented you?"

### 9. Artifact as Reward
End with tangible output:
- Beautiful PDF summary
- Shareable "2025 Goals Locked" graphic
- Commitment contract

## Implementation Priority

### High Impact, Lower Effort
1. Sentence starters in textareas
2. Selection chips before open-ended questions
3. Confidence/rating sliders as warm-ups
4. Constrained inputs (3 bullets max, character limits)
5. Non-linear navigation (skip and return)

### High Impact, Higher Effort
1. Voice-to-text with AI structuring
2. Dynamic prompt generation based on previous answers
3. Previous year data integration
4. Generated PDF artifact
5. "Canvas/Grid" mode alternative to wizard

## Anti-Patterns to Avoid
- Starting with blank textareas (cold start)
- Showing all 46 questions at once (overwhelming)
- Generic placeholders that show answers, not thinking prompts
- No visual progress indicator
- Rigid linear flow with no skip option
