import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthError, AuthShell } from '../components/auth-shell';
import { OpportunityCard } from '../components/opportunity-card';
import { Eyebrow, SiteFooter, SiteHeader } from '../components/site-chrome';
import { opportunities } from '../data/opportunities';
import { getSavedOpportunityState } from '@/lib/saved-opportunities';
import { getPublishedRoleOpportunities } from '@/lib/role-submissions';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

export default async function SavedOpportunitiesPage() {
  const { user, savedIds } = await getSavedOpportunityState();

  if (!user && !isSupabaseConfigured()) {
    return (
      <AuthShell
        eyebrow="Saved opportunities"
        title="Saved opportunities are almost here"
        description="The public directory is ready to explore, but account services still need to be connected to this deployment."
      >
        <AuthError>Supabase is not configured for this site yet.</AuthError>
        <div className="auth-links">
          <Link href="/opportunities">Browse the directory</Link>
        </div>
      </AuthShell>
    );
  }

  if (!user) {
    redirect('/sign-in?message=saved-required&next=/saved');
  }

  const catalog = [...opportunities, ...(await getPublishedRoleOpportunities())];
  const savedOpportunities = savedIds
    .map((savedId) => catalog.find((opportunity) => opportunity.id === savedId))
    .filter((opportunity): opportunity is (typeof catalog)[number] => Boolean(opportunity));

  return (
    <>
      <SiteHeader />
      <main className="saved-page-wrapper">
        <section className="saved-page-header">
          <div>
            <Eyebrow>Your shortlist</Eyebrow>
            <h1>Saved opportunities</h1>
            <p>
              Keep promising scholarships, competitions, and internships in one place while you compare your next steps.
            </p>
          </div>
          <span className="saved-page-count">
            {savedOpportunities.length} <small>Saved</small>
          </span>
        </section>

        <section className="saved-page-content" aria-labelledby="saved-list-heading">
          <div className="saved-page-section-heading">
            <div>
              <Eyebrow>Your list</Eyebrow>
              <h2 id="saved-list-heading">
                {savedOpportunities.length ? 'Worth another look' : 'Nothing saved yet'}
              </h2>
            </div>
            <Link className="secondary-button" href="/opportunities">
              Explore catalog <span aria-hidden="true">↗</span>
            </Link>
          </div>

          {savedOpportunities.length ? (
            <div className="opportunities-grid">
              {savedOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  initialSaved
                  isAuthenticated
                  returnTo="/saved"
                />
              ))}
            </div>
          ) : (
            <div className="empty-directory-box saved-empty-state">
              <span className="saved-empty-icon" aria-hidden="true">♡</span>
              <h3>Start building your shortlist</h3>
              <p>Use the Save button on any opportunity to keep it here for later.</p>
              <Link className="primary-button" href="/opportunities">
                Find opportunities <span aria-hidden="true">↗</span>
              </Link>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
