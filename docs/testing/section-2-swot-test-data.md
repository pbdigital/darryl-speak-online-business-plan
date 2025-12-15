# Section 2: SWOT Analysis - Test Data & Scenarios

## Overview

This document contains realistic test data for a typical real estate agent completing the SWOT Analysis section, along with comprehensive test scenarios.

---

## Test Persona: Sarah Mitchell

- **Experience:** 5 years in residential real estate
- **Market:** Suburban area, mid-range homes ($350K-$600K)
- **Brokerage:** RE/MAX franchise
- **2024 Production:** 18 transactions, $125K GCI
- **Goal for 2026:** Scale to 30 transactions

---

## Part 2A: Strengths (Copy/Paste Data)

| # | Strength | Where can your strength be put to use? |
|---|----------|----------------------------------------|
| 1 | Strong communication skills and ability to explain complex transactions clearly | First-time buyer consultations, listing presentations, negotiating offers, handling objections from skeptical sellers |
| 2 | Deep knowledge of the local school districts and family neighborhoods | Marketing to relocating families, creating neighborhood guides, targeting parents in Facebook groups |
| 3 | Responsive - always answer calls and texts within 30 minutes | Building trust with new leads, managing anxious buyers during escrow, standing out from competitors who ghost clients |
| 4 | Strong social media presence with 2,500+ followers on Instagram | Showcasing new listings, sharing market updates, attracting millennial and Gen-Z first-time buyers |
| 5 | Excellent negotiation skills developed from corporate sales background | Getting top dollar for sellers, negotiating repair requests, winning multiple offer situations for buyers |
| 6 | Bilingual - fluent in Spanish and English | Serving the growing Hispanic community in my market, expanding SOI into underserved demographic |
| 7 | Strong relationships with 3 reliable lenders who close on time | Smoother transactions, confident recommendations to clients, fewer deals falling through |
| 8 | Genuine passion for helping first-time buyers achieve homeownership | Creating educational content, hosting first-time buyer seminars, building referral network from satisfied new homeowners |

---

## Part 2B: Weaknesses (Copy/Paste Data)

| # | Weakness | Action |
|---|----------|--------|
| 1 | Inconsistent prospecting - only call my database when I'm slow | **Improve** |
| 2 | Poor at delegating - try to do everything myself including admin tasks | **Delegate** |
| 3 | Struggle with luxury market - lack confidence with high-net-worth clients | **Improve** |
| 4 | Disorganized CRM - contacts are scattered across multiple systems | **Improve** |
| 5 | Weak video presence - uncomfortable on camera for property tours | **Improve** |
| 6 | Limited farming knowledge - never successfully worked a geographic area | **Improve** |
| 7 | Impatient with slow-moving buyers who take months to decide | **Accept** |
| 8 | Avoid difficult conversations - delay delivering bad news to clients | **Improve** |

---

## Part 2C: Opportunities (Copy/Paste Data)

| # | Business Possibilities | Action Steps to Take |
|---|------------------------|----------------------|
| 1 | New tech company opening HQ nearby - 500+ employees relocating to area | Partner with company's HR department, create relocation guide, host welcome webinars for incoming employees |
| 2 | Rising interest in multi-generational homes due to aging population | Get certified in senior real estate specialist (SRES), create content about ADU conversions, network with elder law attorneys |
| 3 | Several top agents in my office are retiring in the next 2 years | Build relationships now, offer to help with their transactions, position myself as successor to their clients |
| 4 | Local builder launching new subdivision with 150 homes | Get on builder's preferred agent list, host hard hat tours, become the neighborhood expert before anyone else |
| 5 | Growing demand for investment properties from out-of-state buyers | Learn investment metrics (cap rate, cash-on-cash), partner with property managers, join local landlord associations |
| 6 | Divorce rate creating need for agents who understand complex situations | Get divorce real estate certification, network with family law attorneys, create sensitive marketing materials |
| 7 | First-time buyers priced out of metro area looking at my suburban market | Create comparison content (city vs suburb), target urban apartment renters on social media, host "Escape the City" buyer seminars |
| 8 | Commercial-to-residential conversions happening in downtown area | Study mixed-use regulations, connect with developers, position for condo conversion listings |

---

## Part 2D: Threats (Copy/Paste Data)

| # | Possible Threats | Action Steps to Take |
|---|------------------|----------------------|
| 1 | Rising interest rates making buyers hesitant to commit | Educate clients on rate buy-downs, focus on monthly payment not rate, build relationships for when rates drop |
| 2 | Discount brokerages and flat-fee services eroding commissions | Clearly articulate my value proposition, track and share my success metrics, focus on service not price |
| 3 | iBuyer programs (Opendoor, Offerpad) targeting my market | Prepare comparison sheets showing net proceeds, stay updated on their offers, position as local expert alternative |
| 4 | Low inventory creating fierce competition for listings | Improve listing presentation skills, target expired and FSBO consistently, build referral pipeline |
| 5 | AI and automation potentially replacing parts of agent role | Embrace technology early, focus on relationship aspects AI can't replace, become tech-forward agent |
| 6 | Economic uncertainty causing potential buyers to stay on sidelines | Maintain consistent prospecting regardless of market, diversify to include investor clients who buy in any market |
| 7 | New agents flooding market with aggressive marketing budgets | Focus on experience and track record, double down on sphere of influence, compete on expertise not advertising |
| 8 | Personal burnout from always being "on" for clients | Set clear boundaries with working hours, schedule regular vacations, consider hiring assistant to handle after-hours |

---

## Test Scenarios

### Functional Tests

#### Navigation Tests
- [ ] **Step progression**: Click "Let's begin" on overview, verify moves to Step 1 (Strengths)
- [ ] **Progress dots**: After completing Step 1, verify can click back to Step 0 (Overview)
- [ ] **Forward lock**: Cannot click Step 3 (Opportunities) before completing Step 2 (Weaknesses)
- [ ] **Back button**: Click "Back" on Step 3, verify returns to Step 2
- [ ] **Browser back**: Use browser back button, verify handled gracefully (no broken state)

#### Data Entry Tests
- [ ] **Text input**: Enter strength text, verify appears in field
- [ ] **Textarea expansion**: Enter long use case text (200+ characters), verify textarea expands
- [ ] **Weakness action selector**: Click "Accept", verify button shows selected state with checkmark
- [ ] **Action toggle**: Click "Delegate" after "Accept" is selected, verify "Accept" deselects
- [ ] **Empty submission**: Progress to next step with empty fields, verify allowed (no validation errors)

#### Auto-Save Tests
- [ ] **Save indicator**: Enter text, wait 2 seconds, verify "Saved" indicator appears
- [ ] **Debounce**: Type rapidly for 5 seconds, verify only one save occurs after typing stops
- [ ] **Navigation save**: Enter data, immediately click "Continue", verify data persists after page reload
- [ ] **Dirty state**: Enter text, refresh page before 2 seconds, verify prompt about unsaved changes (if implemented)

#### Progress Tracking Tests
- [ ] **Item counter**: Enter data in 3 strength rows, verify shows "3 of 8 strengths identified"
- [ ] **Progress bar**: Complete 4 of 8 strengths, verify progress bar shows ~50%
- [ ] **Checkmark indicator**: Fill both fields in row 1, verify checkmark appears
- [ ] **Partial row**: Fill only strength field (not use case), verify no checkmark

### Data Persistence Tests

#### Load/Save Tests
- [ ] **Initial load**: Open Section 2 fresh, verify all fields empty
- [ ] **Page reload**: Enter data in all 8 strengths, reload page, verify data persists
- [ ] **Cross-session**: Enter data, close browser completely, reopen, verify data persists
- [ ] **Multi-tab**: Open Section 2 in two tabs, enter data in tab 1, refresh tab 2, verify data synced

#### Clear Data Tests
- [ ] **Clear page**: On Strengths step, click menu → "Clear Page", verify only strengths cleared
- [ ] **Clear all**: Click menu → "Clear All Data", verify all SWOT data cleared
- [ ] **Clear confirmation**: Verify confirmation dialog appears before clearing
- [ ] **Cancel clear**: Click clear, then cancel, verify data remains

### UI/UX Tests

#### Visual Tests
- [ ] **Row completion state**: Completed rows should have visual distinction (color change)
- [ ] **Step indicator**: Active step dot should be highlighted
- [ ] **Save status**: Status indicator visible in header area
- [ ] **Mobile layout**: On mobile viewport (375px), verify single-column layout

#### Accessibility Tests
- [ ] **Keyboard navigation**: Tab through all fields, verify logical order
- [ ] **Screen reader**: Action buttons have proper aria-labels
- [ ] **Focus indicators**: Visible focus ring on all interactive elements
- [ ] **Color contrast**: All text meets WCAG 2.1 AA contrast requirements

#### Completion Screen Tests
- [ ] **SWOT grid**: After Step 5, verify 2x2 grid shows all entered items
- [ ] **Item count**: Grid shows correct count of filled items per quadrant
- [ ] **Animation**: Verify card reveal animation plays smoothly
- [ ] **Next section link**: "Continue to Section 3" link works

### Edge Cases

#### Input Edge Cases
- [ ] **Max length**: Enter 500+ characters in a field, verify handling
- [ ] **Special characters**: Enter `<script>alert('xss')</script>`, verify sanitized
- [ ] **Emoji**: Enter emoji in strength field, verify saved and displayed correctly
- [ ] **Copy/paste**: Paste formatted text from Word, verify plain text only
- [ ] **Line breaks**: Enter text with line breaks in textarea, verify preserved

#### Network Edge Cases
- [ ] **Offline**: Disconnect network, enter data, verify local save (if implemented)
- [ ] **Slow save**: Throttle network to slow 3G, verify loading states appear
- [ ] **Save failure**: Block API request, verify error toast appears
- [ ] **Retry**: After save failure, make another change, verify retry attempt

#### Session Edge Cases
- [ ] **Session expiry**: Let session expire mid-entry, verify graceful handling
- [ ] **Concurrent edit**: Edit same plan from two devices, verify no data loss
- [ ] **Year change**: Start new year's plan, verify Section 2 is fresh (not copied)

### Integration Tests

#### With Other Sections
- [ ] **Dashboard card**: Complete Section 2, verify dashboard card shows "Completed"
- [ ] **Progress percentage**: Dashboard shows correct % based on steps completed
- [ ] **Section 3 access**: After Section 2 complete, verify Section 3 unlocked (if gated)

#### With Database
- [ ] **Data structure**: Check Supabase `plan_sections` table, verify `data` field has correct JSONB structure
- [ ] **Section key**: Verify record has `section_key: 'swot'`
- [ ] **Timestamps**: Verify `updated_at` changes on each save

---

## Performance Tests

- [ ] **Initial load time**: Section 2 page loads in under 2 seconds
- [ ] **Input latency**: No perceptible delay when typing
- [ ] **Save latency**: Auto-save completes in under 500ms
- [ ] **Step transition**: Animation completes smoothly (no jank)

---

## Browser Compatibility

Test all scenarios in:
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari iOS (mobile)
- [ ] Chrome Android (mobile)

---

## Notes for Testers

1. **Realistic pacing**: A real agent would spend 15-20 minutes on this section. Don't rush.
2. **Think like an agent**: Would a busy real estate professional find this intuitive?
3. **Mobile first**: Many agents will complete this on their phone between showings.
4. **Interruption recovery**: Agents get interrupted constantly - test saving mid-flow.
5. **Year context**: All data should be contextualized for 2026 business planning.

---

## Bug Report Template

When reporting issues, include:

```markdown
**Section:** 2 - SWOT Analysis
**Step:** [0-5]
**Browser:** [Chrome/Safari/Firefox/etc]
**Device:** [Desktop/Mobile/Tablet]
**OS:** [macOS/Windows/iOS/Android]

**Steps to Reproduce:**
1.
2.
3.

**Expected Result:**

**Actual Result:**

**Screenshot/Video:**
```
