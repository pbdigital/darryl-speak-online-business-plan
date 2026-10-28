/**
 * Plan events that tag the user's contact in Keap.
 *
 * Every event is recorded once per user in `plan_events` (unique on
 * user_id + event_key). The first time an event is recorded, the matching
 * Keap tag is applied. Server-only: uses the service role.
 */

export const SECTION_KEYS = [
  'reflection',
  'swot',
  'income-planning',
  'mindset',
  'accountability',
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export type PlanEventKey =
  | 'signed_up'
  | `section_done:${SectionKey}`
  | 'plan_done'
  | 'printed';

export interface RecordPlanEventResult {
  recorded: boolean; // false when the event already existed
  error?: string;
}

/**
 * Records a plan event for a user and applies its Keap tag the first time.
 * Never throws: Keap failures are stored on the event row and logged.
 */
export async function recordPlanEvent(
  userId: string,
  eventKey: PlanEventKey
): Promise<RecordPlanEventResult> {
  void userId;
  void eventKey;
  throw new Error('recordPlanEvent is not implemented yet');
}
