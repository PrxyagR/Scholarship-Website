import { redirect } from 'next/navigation';
import { AuthError, AuthShell } from '../components/auth-shell';
import { SiteFooter, SiteHeader } from '../components/site-chrome';
import StudentDashboard from '../components/student-dashboard';
import { opportunities } from '../data/opportunities';
import {
  getApplicationTracker,
  getRecommendedOpportunities,
  getStudentProfile,
} from '@/lib/student-tools';
import { createClient } from '@/lib/supabase/server';
import { getSavedOpportunityIds } from '@/lib/saved-opportunities';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <AuthShell
        eyebrow="Student dashboard"
        title="Your plan is almost here"
        description="Account services still need to be connected before MaplePath can save your profile and application progress."
      >
        <AuthError>Supabase is not configured for this site yet.</AuthError>
      </AuthShell>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in?message=dashboard-required&next=/dashboard');

  const savedIds = getSavedOpportunityIds(user);
  const savedOpportunities = savedIds
    .map((savedId) => opportunities.find((opportunity) => opportunity.id === savedId))
    .filter((opportunity): opportunity is (typeof opportunities)[number] => Boolean(opportunity));
  const profile = getStudentProfile(user);
  const tracker = getApplicationTracker(user);
  const recommendations = getRecommendedOpportunities(profile, savedIds);

  return (
    <>
      <SiteHeader />
      <StudentDashboard
        userEmail={user.email ?? 'MaplePath student'}
        initialProfile={profile}
        savedIds={savedIds}
        savedOpportunities={savedOpportunities}
        initialTracker={tracker}
        initialRecommendations={recommendations}
      />
      <SiteFooter />
    </>
  );
}
