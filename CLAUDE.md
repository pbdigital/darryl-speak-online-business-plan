# MyPlanForSuccess - Interactive Business Plan

## Project Overview

Building an interactive SaaS-style Business Plan tool for real estate agents on MyPlanForSuccess.com. The platform allows users to create accounts, complete their annual business plan digitally, and save/update it throughout the year.

## Client

- **Company:** Darryl Davis Seminars, Inc.
- **Primary Contact:** Sarah Cornacchio (Vice President)
- **Brand:** Power Agents
- **Existing Site:** https://darrylspeaks.com/ (WordPress + AccessAlly membership site)

## Technology Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| **Framework** | Next.js 14 (App Router) | SSR for landing/marketing pages, API routes for SSO |
| **Language** | TypeScript | Type safety across the app |
| **Styling** | Tailwind CSS | Utility-first, matches PDF design system |
| **UI Components** | shadcn/ui | Radix-based, fully customizable, not a heavy dependency |
| **Forms** | React Hook Form + Zod | Essential for form-heavy app, type-safe validation |
| **State Management** | Zustand | Lightweight, perfect for real-time calculations |
| **Database** | Supabase (Postgres) | Managed Postgres with Row Level Security |
| **Authentication** | Supabase Auth | Multiple providers + custom OAuth for WordPress SSO |
| **Hosting** | Vercel | First-class Next.js integration, edge network |

### Why This Stack

- **Next.js** - Landing page SEO, API routes for SSO callbacks, Vercel integration
- **Tailwind** - Fast styling, easy to match the PDF's navy/light-blue design system
- **shadcn/ui** - Beautiful, accessible components without vendor lock-in
- **React Hook Form** - Performance-optimized for forms with many fields (this app has 100+ inputs)
- **Zod** - Runtime validation that generates TypeScript types
- **Zustand** - Simple state management for Section 3's cascading calculations

---

## Coding Conventions

### File & Folder Naming

- **Files:** Use `kebab-case` for all files (e.g., `business-plan-store.ts`, `income-planning.tsx`)
- **Folders:** Use `kebab-case` (e.g., `business-plan/`, `ui/`)
- **Components:** PascalCase for component names, kebab-case for filenames
  - File: `expense-table.tsx` → Export: `ExpenseTable`
- **Types:** PascalCase, suffix with purpose (e.g., `BusinessPlanData`, `SwotSection`)

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth-related routes (grouped)
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── (marketing)/       # Public marketing pages
│   └── api/               # API routes
├── components/
│   ├── ui/                # shadcn/ui primitives (don't modify heavily)
│   ├── business-plan/     # Business plan section components
│   ├── forms/             # Reusable form components
│   └── layout/            # Layout components (header, footer, nav)
├── lib/
│   ├── supabase/          # Supabase client setup
│   ├── utils.ts           # Utility functions
│   └── constants.ts       # App-wide constants
├── stores/                # Zustand stores
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom React hooks
```

### TypeScript

- **Strict mode:** Always enabled, no `any` types
- **Prefer interfaces** for object shapes, `type` for unions/intersections
- **Export types** from dedicated files in `src/types/`
- **Zod schemas** should mirror TypeScript types and be colocated with forms

```typescript
// Good
interface BusinessPlan {
  id: string;
  year: number;
}

// Avoid
type BusinessPlan = {
  id: any;
  year: any;
}
```

### React Components

- **Functional components only** (no class components)
- **Named exports** for components (not default exports)
- **Props interface** defined above component, suffixed with `Props`
- **Keep components small** - extract sub-components when > 100 lines

```typescript
// Good
interface ExpenseTableProps {
  expenses: ExpenseItem[];
  onUpdate: (index: number, amount: number) => void;
}

export function ExpenseTable({ expenses, onUpdate }: ExpenseTableProps) {
  // ...
}

// Avoid default exports for components
export default function ExpenseTable() {} // Don't do this
```

### Forms (React Hook Form + Zod)

- **One Zod schema per form** - colocate with the form component
- **Use `useForm` with zodResolver** for validation
- **Controlled components** via `Controller` for shadcn/ui inputs
- **Auto-save** on blur or after debounced changes (not on every keystroke)

```typescript
const expenseSchema = z.object({
  amount: z.number().min(0).nullable(),
});

const form = useForm<z.infer<typeof expenseSchema>>({
  resolver: zodResolver(expenseSchema),
});
```

### State Management (Zustand)

- **One store per domain** (e.g., `business-plan-store`, `auth-store`)
- **Keep stores flat** - avoid deep nesting
- **Derive computed values** in selectors, not in state
- **Actions named as verbs** (e.g., `updateExpense`, `recalculate`)

```typescript
// Good - selector for derived value
const totalExpenses = useBusinessPlanStore(
  (state) => state.calculated.annualExpenses
);

// Avoid - storing derived values that could be computed
```

### Styling (Tailwind CSS)

- **Use Tailwind utilities** - avoid custom CSS unless absolutely necessary
- **Design tokens** via CSS variables in `globals.css` (shadcn/ui pattern)
- **Responsive:** Mobile-first (`sm:`, `md:`, `lg:` breakpoints)
- **Dark mode:** Support via `dark:` variant (future consideration)

```typescript
// Good - Tailwind utilities
<div className="flex flex-col gap-4 p-6 bg-card rounded-lg">

// Avoid - inline styles
<div style={{ display: 'flex', padding: '24px' }}>
```

### Brand Colors (from PDF)

```css
/* Primary colors to use */
--navy-dark: #1a2744;      /* Headers, primary buttons */
--navy-light: #2d3e5f;     /* Secondary elements */
--blue-light: #e8f4f8;     /* Table rows, backgrounds */
--white: #ffffff;          /* Content areas */
--text-primary: #1a1a1a;   /* Body text */
--text-muted: #6b7280;     /* Secondary text */
```

### API Architecture (Supabase Edge Functions + RLS)

#### Overview

All database interactions go through **Supabase Edge Functions** following REST best practices:
- **Edge Functions** handle business logic, validation, and data transformation
- **Row Level Security (RLS)** enforces authorization at the database level
- **Client** calls Edge Functions via fetch, never queries Supabase directly for mutations

#### Why Edge Functions?

1. **Security** - Business logic stays server-side, not exposed in client bundles
2. **Validation** - Zod schemas validate input before touching the database
3. **Consistency** - Single source of truth for data operations
4. **Flexibility** - Can add logging, rate limiting, webhooks without client changes

#### Edge Function Structure

```
supabase/
└── functions/
    ├── business-plans/
    │   └── index.ts          # CRUD for business plans
    ├── plan-sections/
    │   └── index.ts          # CRUD for plan sections
    └── _shared/
        ├── cors.ts           # CORS headers helper
        ├── response.ts       # Standard response envelope
        └── validate.ts       # Zod validation helper
```

#### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/business-plans` | List user's business plans |
| `GET` | `/business-plans/:id` | Get single business plan |
| `POST` | `/business-plans` | Create new business plan |
| `PUT` | `/business-plans/:id` | Update business plan |
| `DELETE` | `/business-plans/:id` | Delete business plan |
| `GET` | `/plan-sections?plan_id=:id` | Get sections for a plan |
| `PUT` | `/plan-sections/:id` | Update a section (auto-save) |

#### Standard Response Envelope

All Edge Functions return JSON in this format:

```typescript
// Success response
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-12-08T10:30:00Z"
  }
}

// Error response
{
  "success": false,
  "errors": [
    { "field": "year", "message": "Year must be between 2024 and 2030" }
  ],
  "meta": {
    "timestamp": "2024-12-08T10:30:00Z"
  }
}
```

#### Edge Function Example

```typescript
// supabase/functions/business-plans/index.ts
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const createPlanSchema = z.object({
  year: z.number().min(2024).max(2030),
});

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ success: false, errors: [{ message: 'Unauthorized' }] }, { status: 401 });
  }

  if (req.method === 'POST') {
    const body = await req.json();
    const parsed = createPlanSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({
        success: false,
        errors: parsed.error.issues.map(i => ({ field: i.path.join('.'), message: i.message }))
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('business_plans')
      .insert({ user_id: user.id, year: parsed.data.year })
      .select()
      .single();

    if (error) {
      return Response.json({ success: false, errors: [{ message: error.message }] }, { status: 500 });
    }

    return Response.json({ success: true, data }, { status: 201 });
  }

  // ... handle other methods
});
```

#### Client-Side Usage

```typescript
// src/lib/api/business-plans.ts
import { createClient } from '@/lib/supabase/client';

const FUNCTIONS_URL = process.env.NEXT_PUBLIC_SUPABASE_URL + '/functions/v1';

export async function createBusinessPlan(year: number) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const response = await fetch(`${FUNCTIONS_URL}/business-plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify({ year }),
  });

  return response.json();
}
```

#### Row Level Security (RLS)

RLS policies handle authorization - Edge Functions don't need to check ownership:

```sql
-- Users can only see their own business plans
CREATE POLICY "Users can view own plans"
  ON business_plans FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert plans for themselves
CREATE POLICY "Users can create own plans"
  ON business_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own plans
CREATE POLICY "Users can update own plans"
  ON business_plans FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own plans
CREATE POLICY "Users can delete own plans"
  ON business_plans FOR DELETE
  USING (auth.uid() = user_id);
```

#### When to Use Direct Supabase Queries

Use direct Supabase client queries (with RLS) for:
- **Read-only operations** in Server Components (data fetching for initial page load)
- **Real-time subscriptions** (listening for changes)

Use Edge Functions for:
- **All mutations** (POST, PUT, DELETE)
- **Complex business logic** (calculations, validations)
- **Operations requiring multiple queries** (transactions)

### API Routes (Next.js)

Next.js API routes (`src/app/api/`) are used only for:
- **SSO callbacks** (WordPress OAuth redirect handling)
- **Webhooks** (external service integrations)
- **Non-database operations** (health checks, etc.)

**Do NOT** use Next.js API routes for database CRUD - use Edge Functions instead.

### Error Handling

- **Use try/catch** in async functions
- **User-friendly error messages** - never expose raw errors to UI
- **Log errors** server-side for debugging
- **Toast notifications** for user feedback (success/error)

### Comments & Documentation

- **Self-documenting code** - prefer clear naming over comments
- **JSDoc for complex functions** - especially utilities and hooks
- **TODO format:** `// TODO: [description] - [your name/date]`
- **No commented-out code** - delete it, git has history

### Git Conventions

- **Branch naming:** `feature/`, `fix/`, `chore/` prefixes
- **Commit messages:** Present tense, imperative mood
  - Good: "Add expense calculation logic"
  - Bad: "Added expense calculation logic"
- **PR size:** Keep PRs small and focused (< 400 lines ideal)

### Testing (Future)

- **Vitest** for unit tests
- **Playwright** for E2E tests
- **Test file naming:** `*.test.ts` or `*.spec.ts` colocated with source

---

## Authentication Strategy

### Phase 1 (December - Launch)
- Power Agent SSO via WordPress plugin on darrylspeaks.com

### Phase 2 (January)
- Email/password
- Google OAuth
- Apple OAuth

### SSO Integration Approach

We need to build a **WordPress plugin on darrylspeaks.com** to handle Power Agent SSO:

**Option A: OAuth2 Server on WordPress**
- Install/build OAuth2 provider on darrylspeaks.com
- MyPlanForSuccess becomes OAuth client
- User clicks "Login with Power Agent" -> redirected to darrylspeaks.com -> authenticates -> redirected back with token

**Option B: JWT Token Exchange**
- WordPress plugin generates signed JWT for authenticated users
- MyPlanForSuccess validates JWT against shared secret
- Simpler but requires careful security implementation

**Option C: Existing AccessAlly Integration**
- Leverage AccessAlly's existing auth system
- Build bridge endpoint that AccessAlly can call
- May require AccessAlly API exploration

**Key Requirements:**
- Users who create accounts before SSO must retain access to same saved plan once SSO is added
- Link WordPress user ID to Supabase user record
- Handle account linking (if user signs up with email first, then later uses SSO)

---

## Reference Documents

The source material for this application exists in two formats:

| Document | Purpose |
|----------|---------|
| `Your Ultimate 2026 Real Estate Business Plan.pdf` | Original PDF design with visual layout, branding, and styling |
| `Your Ultimate 2026 Real Estate Business Plan.md` | Developer-friendly markdown with all questions, field types, and form structure annotations |

**Use the markdown file** (`Your Ultimate 2026 Real Estate Business Plan.md`) as the primary reference when:
- Building form components (includes field type annotations like `text`, `textarea`, `currency`, `calculated`)
- Understanding the exact wording of questions and prompts
- Implementing section structure and navigation flow
- Identifying which fields are calculated vs user-input

**Use the PDF** (`Your Ultimate 2026 Real Estate Business Plan.pdf`) as reference for:
- Visual design and branding
- Color schemes and typography
- Layout inspiration and spacing
- Client-facing look and feel

---

## Business Plan Structure (from PDF)

The 2026 Business Plan PDF has **5 major sections** across 57 pages:

### Section 1: Annual Reflection & Intention Setting (Pages 3-10)

**1.1 Last Year in Review** (Page 4)
- Production Numbers (numeric inputs):
  - Listings Taken
  - Seller Sides Closed
  - Buyer Sides Closed
  - Renter Transactions
  - Gross Closed Commissions
- Reflection Questions (text areas):
  - Did you achieve your goals last year? Why or why not?
  - What were your biggest struggles?
  - What was your biggest accomplishment?
  - How did you prospect last year?
  - What went well that you want to continue?

**1.2 New Year's Reflection & Intention-Setting Worksheet** (Pages 5-10)
- Looking Back (3 questions)
- Gratitude (3 questions)
- Self-Reflection (3 questions)
- Values and Priorities (2 questions)
- Goals and Intentions (4 questions)
- Obstacles and Strategies (2 questions)
- Self-Care and Well-Being (3 questions)
- Personal Growth and Learning (2 questions)
- Giving Back and Contribution (2 questions)
- One Word or Mantra (1 input)
- Accountability and Tracking (3 questions)
- Celebration and Reflection (4 questions)

### Section 2: SWOT Analysis (Pages 11-15)

**2.1 Strengths** (Page 12)
- 8 rows, each with:
  - Strength (text input)
  - Where can your strength be put to use (text input)

**2.2 Weaknesses** (Page 13)
- 8 rows, each with:
  - Weakness (text input)
  - Action: Accept / Delegate / Improve (checkbox selection)

**2.3 Opportunities** (Page 14)
- 8 rows, each with:
  - Business Possibilities (text input)
  - Action Steps to Take (text input)

**2.4 Threats** (Page 15)
- 8 rows, each with:
  - Possible Threats (text input)
  - Action Steps to Take (text input)

### Section 3: Vision, Goals & Income Planning (Pages 16-28)

**This is the most calculation-heavy section with 8 interconnected parts:**

**Part 3A: Understanding Your Financial Foundation** (Pages 17-18)

*Step 1: Monthly Personal Expenses*
- 20 expense line items (Mortgage/Rent, Car Payment, Car Gas, etc.)
- Each has monthly amount input
- Auto-calculate: MONTHLY PERSONAL TOTAL

*Step 2: Monthly Business Expenses*
- 14 expense line items (Board Dues, MLS Fees, Desk Fees, etc.)
- Pro tip: annual amounts divided by 12
- Auto-calculate: MONTHLY BUSINESS TOTAL

*Step 3: Total Annual Expenses*
- Total Monthly Personal Expenses (from Step 1)
- Total Monthly Business Expenses (from Step 2)
- COMBINED MONTHLY TOTAL (auto-calc)
- ANNUAL EXPENSES (multiply by 12)

**Part 3B: Your Manifest List** (Pages 19-20)

*Family Goals* - 5 rows: Goal Name + Money Needed
*Financial Goals* - 5 rows: Goal Name + Money Needed
*Personal Goals* - 5 rows: Goal Name + Money Needed
*Business Goals* - 5 rows: Goal Name + Money Needed
- Auto-calculate: TOTAL COST OF MANIFEST LIST

**Part 3C: Calculating Target Take-Home Income** (Page 21)
- Total Annual Expenses (from Part 3A) - auto-filled
- Total Manifest Goals (from Part 3B) - auto-filled
- TARGET ANNUAL TAKE-HOME INCOME (auto-calc: sum of above)

**Part 3D: Accounting for Taxes** (Pages 21-22)
- Estimated Tax Rate input (percentage)
- Step 1: Tax Rate / 100 (auto-calc)
- Step 2: 1.0 - Step 1 result (auto-calc)
- Target Take-Home Income (from Part 3C) - auto-filled
- Step 3: Take-home / Step 2 result (auto-calc)
- ANNUAL TAXABLE INCOME NEEDED (auto-calc)

**Part 3E: Calculating GCI Goal** (Pages 22-23)

*Step 1: Broker Commission Split*
- Broker's Commission Split Percentage input
- Step 1: Split / 100 (auto-calc)
- Step 2: 1.0 - Step 1 = Your Share (auto-calc)
- Annual Taxable Income Needed (from Part 3D) - auto-filled
- Step 3: Taxable income / Your Share (auto-calc)
- GCI NEEDED (before broker split)

*Step 2: Broker Cap (Optional)*
- Broker's Capped Commission Amount input
- My Taxable Income Needed - auto-filled
- ADJUSTED GCI NEEDED (auto-calc)

**Part 3F: Transaction Requirements** (Pages 23-24)

*Step 1: Average Commission Per Transaction*
- Average Sales Price in My Market (input)
- Average Commission Rate (input, e.g., 2.5% = 0.025)
- Multiply them (auto-calc)
- AVERAGE COMMISSION PER TRANSACTION

*Step 2: Total Transactions Needed*
- GCI Goal (from Part 3E) - auto-filled
- Average Commission Per Transaction - auto-filled
- Divide GCI by Average Commission (auto-calc)
- TOTAL TRANSACTIONS NEEDED IN 2026

**Part 3G: Reverse Engineering Daily Activities** (Pages 24-25)

*Conversion Ratios (constants):*
- 5 appointments = 1 closed transaction
- 16 conversations = 1 appointment
- 12.5 reach-outs = 1 conversation

*Step 1: Annual Activity Goals*
| Activity | Calculation | Your Number |
|----------|-------------|-------------|
| Closed Transactions | From Part 3F | auto-filled |
| Appointments Needed | Transactions x 5 | auto-calc |
| Conversations Needed | Appointments x 16 | auto-calc |
| Reach-Outs Needed | Conversations x 12.5 | auto-calc |

*Step 2: Daily Activity Goals*
- Days per week input
- Weeks off input
- Working days = (Days x 52) - (Days x Weeks off) (auto-calc)
- REACH-OUTS PER DAY (auto-calc)
- CONVERSATIONS PER DAY (auto-calc)
- APPOINTMENTS PER DAY (auto-calc)

**Part 3H: Your Income Commitment** (Pages 26-28)
- Summary display of all calculated values
- Text areas for:
  - "Reaching this goal means..."
  - "Failing to reach this goal means..."
- Numbers At-a-Glance Summary table
- Signature and Date fields

### Section 4: Mindset, Self-Care & Motivation (Pages 29-33)

**4.1 Affirmations** (Page 30)
- 5 text inputs for personal affirmations

**4.2 Grounding Rituals** (Page 30)
- Morning Routine (text area)
- Evening Routine (text area)

**4.3 Boundaries** (Page 31)
- 4 bullet points for boundaries

**4.4 Self-Care Practices & Commitments** (Page 31)
- 4 bullet points

**4.5 Motivation Triggers** (Page 32)
- What Motivates Me (text area)

**4.6 Support Environment** (Page 32)
- My Support System (4 bullet points)

**4.7 Who Do You Need to Become?** (Page 33)
- Free-form text area

### Section 5: Accountability & Progress Tracking (Pages 34-51)

**5.1 Project Matrix** (Pages 34-37)
- 5 project columns
- 5 task rows per project
- Example projects: List 24 Properties, Hire an Assistant, Have a CRM, Work a Farm, Write 1 Contract/Month

**5.2 Exploring Your Resources** (Pages 36-37)
- Current Resources (What You Have) - 4 bullet points
- Needed Resources (What You Need to Acquire) - 4 bullet points

**5.3 Defining Your Ideal Client** (Page 38)
Two Ideal Client Profiles, each with:
- Name Your Ideal Client
- Who Are They?
- What Motivates Them?
- Where Are They?
- How Can I Get in Front of Them?

**5.4 Your Prospecting Mix** (Pages 39-40)
3 Prospecting Activities, each with:
- Activity
- How? (Method/Tool)
- Who? (Target audience)
- When? (Schedule)
- Farm Area?
- Cost?
- Follow-Up Plan

**5.5 Your Marketing Mix** (Pages 41-42)
3 Marketing Activities, each with:
- Activity
- How? (Platform/Method)
- Who? (Target audience)
- When? (Timeline)
- Farm Area?
- Cost?

**5.6 Quarterly Marketing Overview** (Page 42)
- Q1: 2 strategies
- Q2: 2 strategies
- Q3: 2 strategies
- Q4: 2 strategies

**5.7 Commitment Contract** (Page 51)
- Name input
- Transaction goal input
- Reward if goal obtained (text area)
- Consequence if fail (text area)
- Accountability partner name
- Agent signature + date
- Accountability partner signature + date

---

## Database Architecture

### Multi-Year Support
- Each user can have one plan per year (2026, 2027, etc.)
- Users retain previous years' data when creating new plans
- Schema should include `year` field on business plan records

### Data Model Considerations
```
users
  - id (UUID, from Supabase Auth)
  - email
  - wordpress_user_id (for SSO linking)
  - created_at

business_plans
  - id
  - user_id (FK)
  - year (2026, 2027, etc.)
  - created_at
  - updated_at

-- Section data can be stored as JSONB or normalized tables
-- JSONB is simpler for forms with many fields
plan_sections
  - id
  - business_plan_id (FK)
  - section_key (e.g., "reflection", "swot", "income_planning")
  - data (JSONB)
  - updated_at
```

---

## Real-Time Calculations

All calculations in Section 3 must work **in real-time** as users input data:

**Calculation Flow:**
```
Personal Expenses + Business Expenses = Annual Expenses
Annual Expenses + Manifest Goals = Target Take-Home Income
Target Take-Home / (1 - Tax Rate) = Taxable Income Needed
Taxable Income / (1 - Broker Split) = GCI Goal
GCI Goal / Avg Commission = Transactions Needed
Transactions x 5 = Appointments Needed
Appointments x 16 = Conversations Needed
Conversations x 12.5 = Reach-Outs Needed
Annual Activities / Working Days = Daily Targets
```

---

## Admin Features

- View user accounts
- Reset user access
- Export data as CSV
- Troubleshoot user issues

---

## Design Requirements

- Clean, modern SaaS interface
- Mobile-responsive layout
- Visual style inspired by the 2026 Business Plan PDF
  - Dark navy blue (#1a2744 approx) headers
  - Light blue (#e8f4f8 approx) table rows
  - White content areas
  - Darryl Davis Seminars branding
  - Power Agent logo
- Professional UI suitable for a $20/month standalone tool

---

## API Response Standards

Per global CLAUDE.md rules:
- All Ajax/XHR/fetch endpoints **MUST return JSON only**
- Use envelope pattern: `{ "success": true|false, "view": "<step|component>", "data": { ... }, "errors": [ ... ] }`
- **NEVER** return raw HTML in Ajax responses
- Client-side components handle all rendering

---

## Out of Scope (Current Phase)

- SOI Calculator (future module)
- Farming Tool (future module)
- Mobile app
- PDF export (can be added later: 3-20 hrs depending on styling)
- Payment/subscription system
- Email reminders/notifications
- Video tutorials for end users
- Broker/team dashboards
- Digital Darryl AI integration

---

## Future Roadmap (Post-Launch)

- Monthly and weekly activity breakdowns
- Activity Tracker migration to React
- Tracking spreadsheet conversions
- Year-round planning system (not just annual)
- Integration with existing tools referenced in PDF:
  - Daily Call Tracker / Prospecting Breakthrough Log
  - Weekly Planning Sheet
  - 30-Day Commitment Challenge
  - Activity Tracker
  - Dot Board
  - Quarterly Integrity Sheet
  - Listing Inventory Chart

---

## Related Projects

- **Listing Report Card (LRC):** Currently on WordPress, will be converted to React for MyPlanForSuccess in January
- **SOI Calculator:** Future module
- **Farming Calculator:** Future module

---

## Investment & Timeline

- **Budget:** 150 development hours ($14,250 AUD / ~$9,375 USD)
- **Phase 1 (Before New Year):** Core platform live with Power Agent SSO, all Business Plan modules functional
- **Phase 2 (Early January):** Additional login options, SSO refinements, UI polish based on feedback

---

## Integration Notes

- Platform is standalone, does not interfere with existing WordPress/AccessAlly/Infusionsoft/Spiffy
- Can integrate with Infusionsoft for future subscription management
- **SSO bridge requires WordPress plugin on darrylspeaks.com**
- Must handle account linking for users who sign up before SSO is available
- Main Linear Project is called `MyPlanForSuccess - Interactive Business Plan` found in the `Darryl Speaks` team in Linear