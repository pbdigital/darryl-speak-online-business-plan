import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SectionThreeForm } from '@/components/business-plan/section-three';

export default async function SectionThreePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <SectionThreeForm />;
}
