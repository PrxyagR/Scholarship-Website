import RoadmapBuilder from '../components/roadmap-builder';
import { SiteFooter, SiteHeader } from '../components/site-chrome';
import { opportunities, type StudyFocus } from '../data/opportunities';
import { getSavedOpportunityIds } from '@/lib/saved-opportunities';
import { getRoadmapAnswers, type RoadmapAnswers } from '@/lib/roadmap';
import { getRecommendedOpportunities, getStudentProfile, type StudentProfile } from '@/lib/student-tools';
import { createClient } from '@/lib/supabase/server';
import { getPublishedRoleOpportunities } from '@/lib/role-submissions';

export const dynamic = 'force-dynamic';

export default async function RoadmapPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const catalog = [...opportunities, ...(await getPublishedRoleOpportunities())];
  const isGuest = !user;

  const profile: StudentProfile = isGuest
    ? {
        grade: 11,
        province: 'Ontario',
        focuses: ['Computer science', 'Mathematics'] as StudyFocus[],
      }
    : getStudentProfile(user);

  const savedIds = isGuest
    ? ['loran-scholarship', 'canadian-computing-competition', 'shad-canada']
    : getSavedOpportunityIds(user);

  const initialAnswers: RoadmapAnswers = isGuest
    ? {
        goal: 'build',
        format: 'a mix of both',
        time: '3–5 hours',
        focuses: ['Computer science', 'Mathematics'] as StudyFocus[],
      }
    : getRoadmapAnswers(user);

  const recommendations = getRecommendedOpportunities(profile, savedIds, catalog);

  return (
    <>
      <SiteHeader />
      {isGuest && (
        <div className="bg-[var(--surface-sunken)] border-b border-[var(--border-subtle)] px-4 py-2.5 text-center text-xs font-medium text-[var(--ink-secondary)]">
          <span className="font-semibold text-[var(--spruce-primary)]">🍁 Interactive Preview:</span>{' '}
          You are viewing the Roadmap Builder with sample Grade 11 milestones.{' '}
          <a href="/sign-in" className="font-semibold text-[var(--maple-primary)] underline hover:text-[var(--maple-deep)]">
            Sign in
          </a>{' '}
          to save and sync your plan.
        </div>
      )}
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
