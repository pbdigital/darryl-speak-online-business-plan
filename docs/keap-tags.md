# Keap tags and fields for the free business plan

The app tags a user's Keap contact when they reach key moments in their plan, so DDS's Keap automations can follow up. Each event is recorded once per user in the `plan_events` table; the tag is applied only the first time.

Only **free** accounts are sent to Keap. POWER AGENT members (`profiles.account_type = 'member'`) still get `plan_events` rows for reporting, but nothing is sent to Keap and the row's `keap_error` reads `skipped: member`. This keeps members, whose plans are copied forward fully filled each year, out of the free-plan nudges.

## Setup

| Variable | Purpose |
| --- | --- |
| `KEAP_MODE` | `fake` logs what would be sent and calls nothing. `live` calls Keap. Defaults to `fake` when `KEAP_API_KEY` is empty, otherwise `live`. |
| `KEAP_API_KEY` | A Keap Service Account Key, sent as the `X-Keap-API-Key` header. |
| `KEAP_TAG_*` | The numeric Keap tag ID for each event (see below). |
| `KEAP_FIELD_*` | The numeric Keap custom field ID for each plan number (see below). |
| `SUPABASE_SERVICE_ROLE_KEY` | Used server-side to write `plan_events` and `profiles.keap_contact_id`. |

In live mode the app finds the contact by email (or creates one with the user's first and last name), stores its ID in `profiles.keap_contact_id`, then applies the tag. If anything fails, the error is written to `plan_events.keap_error` and logged; the user never sees it. A successful sync sets `plan_events.keap_synced_at`. A missing tag ID in live mode is recorded as an error, so it shows up when checking the table.

## Tags

| Event | Env variable | Suggested Keap tag name | Fires when |
| --- | --- | --- | --- |
| `signed_up` | `KEAP_TAG_SIGNED_UP` | Free Plan: Signed Up | The user creates a free plan account. |
| `section_done:reflection` | `KEAP_TAG_SECTION_DONE_REFLECTION` | Free Plan: Section 1 Reflection Done | Section 1 (Annual Reflection) is complete and saved. |
| `section_done:swot` | `KEAP_TAG_SECTION_DONE_SWOT` | Free Plan: Section 2 SWOT Done | Section 2 (SWOT) is complete and saved. |
| `section_done:income-planning` | `KEAP_TAG_SECTION_DONE_INCOME_PLANNING` | Free Plan: Section 3 Income Plan Done | Section 3 (Income Planning) is complete and saved. |
| `section_done:mindset` | `KEAP_TAG_SECTION_DONE_MINDSET` | Free Plan: Section 4 Mindset Done | Section 4 (Mindset) is complete and saved. |
| `section_done:accountability` | `KEAP_TAG_SECTION_DONE_ACCOUNTABILITY` | Free Plan: Section 5 Accountability Done | Section 5 (Accountability) is complete and saved. |
| `plan_done` | `KEAP_TAG_PLAN_DONE` | Free Plan: Whole Plan Done | All five sections are done. |
| `printed` | `KEAP_TAG_PRINTED` | Free Plan: Printed | The user prints or saves the plan as PDF from the whole-plan page. |

A section counts as done when the user reaches its final step with every required answer filled in (the same rule as the dashboard's progress). The server checks the saved answers before recording it.

## Custom fields

When Section 3 is done, and again when the whole plan is done, the app writes the plan's key numbers to the contact's custom fields, so DDS can send emails such as "your goal is 24 sales this year". Create these as number fields in Keap (the plan year can be a number or text field). Any field without an ID set is skipped quietly.

| Env variable | Suggested Keap field name | Value |
| --- | --- | --- |
| `KEAP_FIELD_GCI_GOAL` | Free Plan GCI Goal | Gross commission income needed for the year, in whole dollars. |
| `KEAP_FIELD_TRANSACTIONS_GOAL` | Free Plan Transactions Goal | Transactions to close in the year. |
| `KEAP_FIELD_CONVERSATIONS_PER_WEEK` | Free Plan Conversations Per Week | Conversations needed each working week, rounded up. |
| `KEAP_FIELD_PLAN_YEAR` | Free Plan Year | The plan year, for example 2027. |
