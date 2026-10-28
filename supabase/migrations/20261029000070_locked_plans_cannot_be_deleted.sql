-- A locked plan can't be edited, and that includes deleting it or its
-- sections. The original owner delete policies stay; these restrictive
-- policies add the lock on top. The service role bypasses RLS as before.

create policy "Locked users cannot delete plans"
  on public.business_plans
  as restrictive
  for delete
  using (not public.is_plan_locked());

create policy "Locked users cannot delete plan sections"
  on public.plan_sections
  as restrictive
  for delete
  using (not public.is_plan_locked());
