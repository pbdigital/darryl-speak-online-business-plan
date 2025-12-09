import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SectionTwoForm } from "@/components/business-plan/section-two";

export default async function SectionTwoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <SectionTwoForm />;
}
