import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#1a2744] text-white p-8">
      <h1 className="text-4xl font-bold mb-4 text-center">LANDING PAGE COMING SOON</h1>
      <p className="text-lg text-gray-300 mb-8 text-center max-w-md">
        This will be replaced by the page being designed in Figma. For now, please proceed to the login page.
      </p>
      <Button asChild size="lg" className="bg-white text-[#1a2744] hover:bg-gray-100">
        <Link href="/login">Login</Link>
      </Button>
    </main>
  );
}
