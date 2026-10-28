'use client';

import { useEffect, useRef } from 'react';
import type { PlanEventKey, SectionKey } from './events';

/**
 * Client-side helpers that report plan events to /api/plan-events.
 * Fire-and-forget: they never block or break the UI.
 */

/** Sends a plan event. Resolves to whether the server accepted it. */
export function sendPlanEvent(
  event: Extract<PlanEventKey, 'printed' | `section_done:${SectionKey}`>
): Promise<boolean> {
  return fetch('/api/plan-events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event }),
    keepalive: true,
  })
    .then((response) => response.ok)
    .catch(() => false);
}

/**
 * Reports section_done once the section is complete and saved. `done` should
 * be true only when the section's progress is 100% and the store has no
 * unsaved changes, so the server sees the same data when it checks.
 */
export function useSectionDoneEvent(sectionKey: SectionKey, done: boolean): void {
  const sent = useRef(false);

  useEffect(() => {
    if (!done || sent.current) return;
    sent.current = true;
    sendPlanEvent(`section_done:${sectionKey}`).then((ok) => {
      // Allow a retry the next time the section becomes done and saved.
      if (!ok) sent.current = false;
    });
  }, [done, sectionKey]);
}
