# Activity Tracker & Dot Board — Scope Document

**Prepared for:** Darryl Davis Seminars, Inc.
**Prepared by:** PB Digital
**Date:** January 2026
**Version:** 1.0 (Draft for review)

---

## Overview

Two accountability tools to help agents track progress against their business plan throughout the year:

1. **Activity Tracker** — Daily prospecting activity logging
2. **Dot Board** — Monthly transaction scoreboard

Both integrate with the existing Business Plan platform (MyPlanForSuccess.com) and tie back to Section 3's calculated goals.

---

## Package Options

| Feature | Core ($4,500) | Full ($6,000) |
|---------|:-------------:|:-------------:|
| Activity Tracker | ✓ | ✓ |
| Dot Board | ✓ | ✓ |
| Section 3 Integration | ✓ | ✓ |
| Mobile-responsive | ✓ | ✓ |
| Weekly trend chart | — | ✓ |
| Week-over-week comparison | — | ✓ |
| Email nudges | — | ✓ |
| Keap integration (email) | — | ✓ |

---

## Feature Details

### Activity Tracker

**What it does:**
Agents log their daily prospecting activities across different lead sources. The system tracks their progress and shows how they're performing against their Section 3 targets.

**Included in both packages:**

| Feature | Description |
|---------|-------------|
| Daily entry grid | 5-column table: Calls/Activities, Conversations, Appts Scheduled, Appts Attended, Listings Obtained |
| Lead source categories | Pre-defined categories matching current Activity Tracker (FSBOs, Expireds, Past Clients, Farm Area, etc.) |
| Date navigation | Pick any date, navigate forward/back by day |
| Auto-calculating totals | Row totals update as user types |
| 7-day rolling total | Shows sum of last 7 days of activity |
| Section 3 target display | "Your target: X reach-outs/day" pulled from their business plan |
| Target vs actual | Visual indicator showing if they're on pace |
| Mobile layout | Responsive design that works on phone/tablet |
| Data persistence | Saves to Supabase, syncs across devices |

**Included in Full package only:**

| Feature | Description |
|---------|-------------|
| Weekly trend chart | Line chart showing activity over past 4-5 weeks |
| Week-over-week comparison | "+12% from last week" style indicators |
| Filter by metric | Toggle chart between Calls, Conversations, Appointments, etc. |

**NOT included:**

- Custom/editable lead source categories (agents use pre-defined list)
- Leaderboards or team comparisons
- CSV/PDF export of activity data
- Historical data migration from WordPress version
- Admin reporting dashboard

---

### Dot Board

**What it does:**
Visual scoreboard where agents track their closed transactions month by month. Based on Darryl's paper Dot Board concept.

**Included in both packages:**

| Feature | Description |
|---------|-------------|
| Monthly grid | 12 rows (months) × 3 columns (Listings, Listing Sold Side, Buyer Sold Side) |
| Dot entry | Tap to add a dot for each transaction |
| Running totals | Column totals update automatically |
| Section 3 goal display | "Your target: X transactions this year" |
| Progress indicator | "You're at Y of X — Z more to go" |
| Mobile layout | Works on phone/tablet |
| Data persistence | Saves to Supabase, syncs across devices |

**NOT included:**

- Year-over-year comparison
- Detailed transaction info (date, address, commission)
- Integration with MLS or transaction management systems
- Animations or sound effects on dot entry
- PDF export or printable version

---

### Email Nudges (Full Package Only)

**What it does:**
Automated emails that keep agents engaged with the platform.

**Included:**

| Feature | Description |
|---------|-------------|
| Incomplete section reminders | "You haven't finished Section 3 yet" |
| Inactivity nudges | Triggered after X days of no login (configurable) |
| Progress alerts | "You're on track this month!" or "You're behind on reach-outs" |
| Unsubscribe option | Agents can opt out of nudges |
| Keap integration | Emails sent via Keap for CRM tracking |

**NOT included:**

- SMS notifications
- Push notifications
- Custom email templates per agent
- A/B testing of email content
- Detailed email analytics beyond Keap's built-in reporting

---

## Technical Approach

| Component | Technology |
|-----------|------------|
| Frontend | React/Next.js (same as Business Plan) |
| Database | Supabase (new tables for activity tracking) |
| API | Supabase Edge Functions |
| Authentication | Existing Power Agent SSO |
| Email delivery | Keap API (Full package) |
| Hosting | Vercel (same as Business Plan) |

---

## Dependencies & Assumptions

**Dependencies:**
- MYP-70 (completion logic) should be done first — Activity Tracker needs accurate Section 3 data
- Keap API access required for email nudges (Full package)

**Assumptions:**
- Lead source categories are fixed (same as current Activity Tracker)
- Agents enter data manually (no integrations with dialers, CRMs, etc.)
- One Dot Board entry = one closed transaction (not pending/under contract)
- Email nudge frequency and copy to be defined during build

---

## What's NOT in Scope

To keep scope clear, the following are explicitly excluded:

- Admin dashboard for viewing all agents' activity
- Team/broker roll-up reporting
- Integration with external systems (MLS, CRM, dialers)
- Historical data import from WordPress Activity Tracker
- Custom branding or white-labeling
- Native mobile app (this is mobile-responsive web, not App Store app)

Any of these can be added as a future phase.

---

## Timeline

| Package | Estimated Delivery |
|---------|-------------------|
| Core | 3-4 weeks from approval |
| Full | 4-5 weeks from approval |

*Timeline assumes no major scope changes and timely feedback on questions.*

---

## Payment Terms

- 50% deposit to commence
- 50% on completion
- Prices in AUD, exclusive of GST

---

## Questions to Confirm

Before finalizing, please confirm:

1. **Lead source categories** — Use same list as current Activity Tracker, or modify?
2. **Dot Board entry** — One tap per transaction, or include any details (date, type)?
3. **Email nudge timing** — After how many days of inactivity? Weekly summary or triggered?
4. **Keap setup** — Do we have API access, or need to coordinate with your team?

---

## Next Steps

1. Review this document
2. Confirm package choice (Core or Full)
3. Answer the questions above
4. We'll send a formal quote for signature
5. Deposit received → work begins

---

*This document is a draft for discussion. Final scope will be confirmed in the signed quote.*
