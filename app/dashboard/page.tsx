import { redirect } from 'next/navigation';
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
import { getPublishedRoleOpportunities } from '@/lib/role-submissions';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) redirect('/sign-in?message=dashboard-required&next=%2Fdashboard');

  const catalog = [...opportunities, ...(await getPublishedRoleOpportunities())];
  const profile = getStudentProfile(user);
  const savedIds = getSavedOpportunityIds(user);

  const savedOpportunities = savedIds
    .map((savedId) => catalog.find((opportunity) => opportunity.id === savedId))
    .filter((opportunity): opportunity is (typeof catalog)[number] => Boolean(opportunity));

  const initialTracker = getApplicationTracker(user);

  const recommendations = getRecommendedOpportunities(profile, savedIds, catalog);

  return (
    <>
      <SiteHeader />
      <StudentDashboard
        userEmail={user.email ?? 'MaplePath member'}
        initialProfile={profile}
        savedIds={savedIds}
        savedOpportunities={savedOpportunities}
        initialTracker={initialTracker}
        initialRecommendations={recommendations}
        catalog={catalog}
      />
      <SiteFooter />
    </>
  );
}
