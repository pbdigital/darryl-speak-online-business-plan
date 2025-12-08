import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SectionOneForm } from '@/components/business-plan/section-one';

export default async function SectionOnePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <SectionOneForm />;
}
