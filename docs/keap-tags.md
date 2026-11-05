# Keap tags and fields for the free business plan

The app tags a user's Keap contact when they reach key moments in their plan, so DDS's Keap automations can follow up. Each event is recorded once per user in the `plan_events` table; the tag is applied only the first time.

Only **free** accounts are sent to Keap. POWER AGENT members (`profiles.account_type = 'member'`) still get `plan_events` rows for reporting, but nothing is sent to Keap and the row's `keap_error` reads `skipped: member`. This keeps members, whose plans are copied forward fully filled each year, out of the free-plan nudges.

## Setup

| Variable | Purpose |
| --- | --- |
| `KEAP_MODE` | Set to `fake` only for local testing: it logs what would be sent, calls nothing and marks events synced. Otherwise the app calls Keap whenever `KEAP_API_KEY` is set. With no key, nothing is sent and events are marked `not sent: Keap not configured` (see below). |
| `KEAP_API_KEY` | A Keap Service Account Key, sent as the `X-Keap-API-Key` header to the REST v1 API (`https://api.infusionsoft.com/crm/rest/v1`). |
| `KEAP_TAG_*` | The numeric Keap tag ID for each event (see below). |
| `KEAP_FIELD_*` | The numeric Keap custom field ID for each plan number (see below). |
| `SUPABASE_SERVICE_ROLE_KEY` | Used server-side to write `plan_events` and `profiles.keap_contact_id`. |

In live mode the app finds the contact by email (or creates one with the user's first and last name) and stores its ID in `profiles.keap_contact_id`, then applies the tag. Contact lookups for one user run one at a time, and the ID is only stored if none is stored yet, which keeps duplicate contacts down. The user never waits on Keap: the event row is written during the request and the Keap calls run after the response is sent.

### Sync status and retries

| `keap_synced_at` | `keap_error` | Meaning |
| --- | --- | --- |
| set | empty | Sent to Keap (or logged, with `KEAP_MODE=fake`). |
| empty | `skipped: member` | POWER AGENT member. Never sent and never retried. |
| empty | `not sent: Keap not configured` | No `KEAP_API_KEY` when it ran. Retried once the key is set. In production the app also logs a warning once per process. |
| empty | any other text | Keap call failed (or a tag ID is missing); the text is Keap's error. Retried. |
| empty | empty | Recorded, sync not finished yet. |

Retries happen two ways. Whenever any event is recorded for a user, that user's unsynced rows (up to 10, oldest first) are synced again. For users who never come back, `retryUnsyncedPlanEvents(limit)` in `src/lib/keap/events.ts` retries the oldest unsynced rows across everyone; it is ready to call from a scheduled job, which isn't wired up yet.

### Auth header

Keap's developer forum says Service Account Keys and Personal Access Tokens are sent in the `X-Keap-API-Key` header ([API Authentication thread](https://integration.keap.com/t/api-authentication/91017)). Keap's [PAT and SAK page](https://developer.keap.com/pat-and-sak) shows a v2 example using `Authorization: Bearer` instead. The app uses `X-Keap-API-Key` with v1. This hasn't been tested against a live Keap account yet; if Keap returns 401, try the Bearer header.

## Tags

| Event | Env variable | Keap tag name | DDS tag ID | Fires when |
| --- | --- | --- | --- | --- |
| `signed_up` | `KEAP_TAG_SIGNED_UP` | Free Plan: Signed Up | 15617 | The user creates a free plan account. |
| `section_done:reflection` | `KEAP_TAG_SECTION_DONE_REFLECTION` | Free Plan: Section 1 Reflection Done | 15619 | Section 1 (Annual Reflection) is complete and saved. |
| `section_done:swot` | `KEAP_TAG_SECTION_DONE_SWOT` | Free Plan: Section 2 SWOT Done | 15621 | Section 2 (SWOT) is complete and saved. |
| `section_done:income-planning` | `KEAP_TAG_SECTION_DONE_INCOME_PLANNING` | Free Plan: Section 3 Income Plan Done | 15623 | Section 3 (Income Planning) is complete and saved. |
| `section_done:mindset` | `KEAP_TAG_SECTION_DONE_MINDSET` | Free Plan: Section 4 Mindset Done | 15625 | Section 4 (Mindset) is complete and saved. |
| `section_done:accountability` | `KEAP_TAG_SECTION_DONE_ACCOUNTABILITY` | Free Plan: Section 5 Accountability Done | 15627 | Section 5 (Accountability) is complete and saved. |
| `plan_done` | `KEAP_TAG_PLAN_DONE` | Free Plan: Whole Plan Done | 15629 | All five sections are done. |
| `printed` | `KEAP_TAG_PRINTED` | Free Plan: Printed | 15631 | The user prints or saves the plan as PDF from the whole-plan page. |

A section counts as done when the user reaches its final step with every required answer filled in (the same rule as the dashboard's progress). The server checks the saved answers before recording it.

## Custom fields

DDS's Keap has no free custom fields (5 Nov 2026), so these are not set in production and the app skips them. When Section 3 is done, and again when the whole plan is done, the app writes the plan's key numbers to the contact's custom fields, so DDS can send emails such as "your goal is 24 sales this year". Create these as number fields in Keap (the plan year can be a number or text field). Any field without an ID set is skipped quietly.

| Env variable | Suggested Keap field name | Value |
| --- | --- | --- |
| `KEAP_FIELD_GCI_GOAL` | Free Plan GCI Goal | Gross commission income needed for the year, in whole dollars. |
| `KEAP_FIELD_TRANSACTIONS_GOAL` | Free Plan Transactions Goal | Transactions to close in the year. |
| `KEAP_FIELD_CONVERSATIONS_PER_WEEK` | Free Plan Conversations Per Week | Conversations needed each working week, rounded up. |
| `KEAP_FIELD_PLAN_YEAR` | Free Plan Year | The plan year, for example 2027. |
