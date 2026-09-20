import { SiteFooter, SiteHeader } from '../components/site-chrome';
import StudentDashboard from '../components/student-dashboard';
import { opportunities, type StudyFocus } from '../data/opportunities';
import {
  getApplicationTracker,
  getRecommendedOpportunities,
  getStudentProfile,
  type ApplicationTracker,
  type StudentProfile,
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

  const isGuest = !user;
  const catalog = [...opportunities, ...(await getPublishedRoleOpportunities())];

  const profile: StudentProfile = isGuest
    ? {
        grade: 11,
        province: 'Ontario',
        focuses: ['Computer science', 'Mathematics'] as StudyFocus[],
      }
    : getStudentProfile(user);

  const savedIds = isGuest
    ? [
        'loran-scholarship',
        'canadian-computing-competition',
        'shad-canada',
        'university-of-toronto-national-scholarship',
      ]
    : getSavedOpportunityIds(user);

  const savedOpportunities = savedIds
    .map((savedId) => catalog.find((opportunity) => opportunity.id === savedId))
    .filter((opportunity): opportunity is (typeof catalog)[number] => Boolean(opportunity));

  const initialTracker: ApplicationTracker = isGuest
    ? {
        'loran-scholarship': {
          status: 'In progress',
          note: 'Drafted leadership activity essay. Need school counselor nomination letter by October 5.',
          updatedAt: '2026-09-20',
        },
        'canadian-computing-competition': {
          status: 'Planning',
          note: 'Practicing past contest questions from CEMC website.',
          updatedAt: '2026-09-18',
        },
        'shad-canada': {
          status: 'Submitted',
          note: 'Application submitted with project portfolio on youth climate action.',
          updatedAt: '2026-09-15',
        },
      }
    : getApplicationTracker(user);

  const recommendations = getRecommendedOpportunities(profile, savedIds, catalog);

  return (
    <>
      <SiteHeader />
      {isGuest && (
        <div className="bg-[var(--surface-sunken)] border-b border-[var(--border-subtle)] px-4 py-2.5 text-center text-xs font-medium text-[var(--ink-secondary)]">
          <span className="font-semibold text-[var(--spruce-primary)]">🍁 Interactive Preview:</span>{' '}
          You are viewing the Student Dashboard with sample tracked applications and draft notes.{' '}
          <a href="/sign-in" className="font-semibold text-[var(--maple-primary)] underline hover:text-[var(--maple-deep)]">
            Sign in
          </a>{' '}
          to sync your profile across devices.
        </div>
      )}
      <StudentDashboard
        userEmail={user?.email ?? 'Student Guest (Preview)'}
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
