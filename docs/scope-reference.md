# MyPlanForSuccess — Scope Reference

This document summarizes what's included in the current project based on the email agreement from December 5-6, 2024.

---

## Source of Truth

The **2026 Business Plan PDF** is the specification for the interactive tool. We're digitizing the workbook — same sections, same fields, same flow — in a modern, mobile-responsive interface with real-time calculations and saved progress.

---

## What's Included

### Platform Foundation
- User account system
- Supabase database with automated backups
- Vercel hosting
- Admin dashboard (view users, reset access, export CSV, troubleshooting)

### Full Interactive Business Plan

All sections from the PDF:

| Section | Status |
|---------|--------|
| Section 1: Annual Reflection & Intention Setting | Included |
| Section 2: SWOT Analysis | Included |
| Section 3: Vision, Goals & Income Planning | Included |
| Section 4: Mindset, Self-Care & Motivation | Included |
| Section 5: Accountability & Progress Tracking | Included |

This includes:
- All reflection questions and text inputs
- SWOT tables (Strengths, Weaknesses, Opportunities, Threats)
- Expense tracking (personal + business)
- Income planning with real-time calculations
- GCI, transactions, and daily activity targets
- Project Matrix
- Ideal Client profiles
- Prospecting & Marketing Mix
- Commitment Contract

### Design & UI
- Clean, modern interface inspired by the PDF
- Mobile-responsive layout

### Authentication

| Phase | Login Method |
|-------|--------------|
| Phase 1 (December) | Power Agent SSO |
| Phase 2 (January) | Email, Google, Apple |

### Documentation
- Internal guide for the team
- What can be safely updated vs. not
- How to handle annual Business Plan changes

---

## What's NOT Included

These items were explicitly listed as out of scope in the December 5 emails:

| Item | Notes |
|------|-------|
| SOI Calculator | Future module |
| Farming Tool | Future module |
| Mobile app | Not a native app, but web is mobile-responsive |
| PDF export | Can be added later (3-20 hrs depending on styling) |
| Payment/subscription system | For when it becomes a paid tool |
| Email reminders/notifications | Prompts to complete or revisit plan |
| Video tutorials for end users | Internal docs included, user-facing training isn't |
| Broker/team dashboards | Manager views of agent plans |
| Digital Darryl AI integration | |

---

## Tools Referenced in PDF but NOT Part of This Build

The PDF mentions several tools that exist in the "POWER AGENT Classroom" — these are **existing separate products**, not features we're building:

- Daily Call Tracker / Prospecting Breakthrough Log
- Weekly Planning Sheet
- Daily Accomplishment Focus Sheet
- 30-Day Commitment Challenge
- Activity Tracker
- Dot Board
- Quarterly Integrity Sheet
- Listing Inventory Chart
- Marketing Calendar
- 12 months of done-for-you newsletters

The PDF says things like *"Find the Prospecting Breakthrough Log in the Time and Money Management Tab in the POWER AGENT Classroom!"* — we're not recreating these tools.

---

## Future Roadmap (Post Phase 1 & 2)

Sarah mentioned these as future directions to scope separately:

- Monthly and weekly breakdowns of required activity
- Activity Tracker migration to React
- Tracking spreadsheet conversions
- Year-round planning system (not just annual)

> "We'll scope these enhancements with you after the Phase 1 and Phase 2 releases"
> — Sarah, Dec 6

---

## How to Handle New Requests

**If a request matches the PDF:**
It's likely in scope. We're digitizing what's in the workbook.

**If a request goes beyond the PDF:**
It's a new feature. Quote separately.

**Examples:**

| Request | Response |
|---------|----------|
| "Can we change the wording on a question?" | In scope — matches the PDF content |
| "Can we add a field to the expense table?" | In scope — refinement |
| "Can AI analyze Section 1 and suggest SWOT entries?" | Out of scope — new feature |
| "Can we add the Activity Tracker?" | Out of scope — future module |
| "Can users print their plan as a PDF?" | Out of scope — quoted separately (3-20 hrs) |
| "Can we send email reminders to finish the plan?" | Out of scope — new feature |

---

## Key Quotes from Scope Agreement

> "If a major new feature is requested, we understand that would be quoted separately."
> — Sarah, Dec 5

> "All of these could be added fairly easily down the track and the goal is to build something modular so future additions slot in cleanly."
> — Paul, Dec 5

---

## Investment

150 development hours = $14,250 AUD

This covers everything outlined above.
