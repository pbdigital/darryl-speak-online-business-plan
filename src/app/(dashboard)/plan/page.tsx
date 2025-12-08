import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogoutButton } from './logout-button';

export default async function PlanPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single();

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : user.email;

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">MyPlanForSuccess</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {displayName}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary">Your 2026 Business Plan</h2>
          <p className="mt-2 text-muted-foreground">
            Build your roadmap to real estate success
          </p>
        </div>

        {/* Section Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-primary">Section 1</CardTitle>
              <CardDescription>Annual Reflection & Intention Setting</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Review your past year and set intentions for 2026
              </p>
              <Button variant="outline" className="mt-4 w-full">
                Start Section
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-primary">Section 2</CardTitle>
              <CardDescription>SWOT Analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Identify your strengths, weaknesses, opportunities, and threats
              </p>
              <Button variant="outline" className="mt-4 w-full">
                Start Section
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-primary">Section 3</CardTitle>
              <CardDescription>Vision, Goals & Income Planning</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Calculate your GCI goal and daily activity targets
              </p>
              <Button variant="outline" className="mt-4 w-full">
                Start Section
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-primary">Section 4</CardTitle>
              <CardDescription>Mindset, Self-Care & Motivation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Define your affirmations, routines, and support system
              </p>
              <Button variant="outline" className="mt-4 w-full">
                Start Section
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-primary">Section 5</CardTitle>
              <CardDescription>Accountability & Progress Tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set up projects, prospecting mix, and commitment contract
              </p>
              <Button variant="outline" className="mt-4 w-full">
                Start Section
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
