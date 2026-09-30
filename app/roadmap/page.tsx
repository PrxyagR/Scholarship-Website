import { redirect } from 'next/navigation';
import RoadmapBuilder from '../components/roadmap-builder';
import { SiteFooter, SiteHeader } from '../components/site-chrome';
import { opportunities } from '../data/opportunities';
import { getSavedOpportunityIds } from '@/lib/saved-opportunities';
import { getRoadmapAnswers } from '@/lib/roadmap';
import { getRecommendedOpportunities, getStudentProfile } from '@/lib/student-tools';
import { createClient } from '@/lib/supabase/server';
import { getPublishedRoleOpportunities } from '@/lib/role-submissions';

export const dynamic = 'force-dynamic';

export default async function RoadmapPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) redirect('/sign-in?message=roadmap-required&next=%2Froadmap');

  const catalog = [...opportunities, ...(await getPublishedRoleOpportunities())];
  const profile = getStudentProfile(user);
  const savedIds = getSavedOpportunityIds(user);
  const initialAnswers = getRoadmapAnswers(user);

  const recommendations = getRecommendedOpportunities(profile, savedIds, catalog);

  return (
    <>
      <SiteHeader />
      <RoadmapBuilder
        initialAnswers={initialAnswers}
        profile={profile}
        savedCount={savedIds.length}
        recommendations={recommendations}
      />
      <SiteFooter />
    </>
  );
}
