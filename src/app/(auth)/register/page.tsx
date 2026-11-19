import { redirect } from 'next/navigation';

interface RegisterPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Keeps the query string (utm tags from an ad) on the way to the sign-up form.
export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    for (const item of [value].flat()) {
      if (item !== undefined) params.append(key, item);
    }
  }
  params.set('mode', 'signup');
  redirect(`/login?${params}`);
}
