import { redirect } from 'next/navigation';
import { AuthError, AuthShell } from '../components/auth-shell';
import RoadmapBuilder from '../components/roadmap-builder';
import { SiteFooter, SiteHeader } from '../components/site-chrome';
import { getSavedOpportunityIds } from '@/lib/saved-opportunities';
import { getRoadmapAnswers } from '@/lib/roadmap';
import { getRecommendedOpportunities, getStudentProfile } from '@/lib/student-tools';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function RoadmapPage() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <AuthShell
        eyebrow="Student roadmap"
        title="Your roadmap is almost here"
        description="Sign-in services still need to be connected before MaplePath can save your private plan."
      >
        <AuthError>Supabase is not configured for this site yet.</AuthError>
      </AuthShell>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in?message=roadmap-required&next=/roadmap');

  const profile = getStudentProfile(user);
  const savedIds = getSavedOpportunityIds(user);
  const recommendations = getRecommendedOpportunities(profile, savedIds);

  return (
    <>
      <SiteHeader />
      <RoadmapBuilder
        initialAnswers={getRoadmapAnswers(user)}
        profile={profile}
        savedCount={savedIds.length}
        recommendations={recommendations}
      />
      <SiteFooter />
    </>
  );
}
