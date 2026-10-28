import Image from 'next/image';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { LogoutButton } from '@/app/(dashboard)/plan/logout-button';

// Placeholder copy: DDS will sign off the final wording.
export function PlanLockedScreen() {
  const joinUrl =
    process.env.NEXT_PUBLIC_POWER_AGENT_JOIN_URL || 'https://darrylspeaks.com/';

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <section className="bg-[#0F172A] px-6 pb-32 pt-12 text-white md:px-12">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Image src="/logo-white.svg" alt="Darryl Davis Seminars" width={140} height={40} />
          <LogoutButton />
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-20 w-full max-w-3xl px-6 pb-20 md:px-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <Lock className="h-6 w-6 text-slate-700" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Your plan is saved
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Your free 30 days have ended, so your business plan can no longer be
            edited. Everything you wrote is safe, and you can view and print it
            any time.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Become a POWER AGENT® to keep working on your plan all year.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/plan/print"
              className="inline-flex items-center justify-center rounded-lg bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              View and print your plan
            </Link>
            <a
              href={joinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
            >
              Become a POWER AGENT®
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
