import Link from 'next/link';
import { redirect } from 'next/navigation';
import { OpportunityCard } from '../components/opportunity-card';
import { Eyebrow, SiteFooter, SiteHeader } from '../components/site-chrome';
import { MapleWatermark, MapleTreeEmblem } from '../components/brand-motif';
import { opportunities } from '../data/opportunities';
import { getSavedOpportunityState } from '@/lib/saved-opportunities';
import { getPublishedRoleOpportunities } from '@/lib/role-submissions';

export const dynamic = 'force-dynamic';

export default async function SavedOpportunitiesPage() {
  const { user, savedIds } = await getSavedOpportunityState();
  if (!user) redirect('/sign-in?message=saved-required&next=%2Fsaved');

  const catalog = [...opportunities, ...(await getPublishedRoleOpportunities())];

  const savedOpportunities = savedIds
    .map((savedId) => catalog.find((opportunity) => opportunity.id === savedId))
    .filter((opportunity): opportunity is (typeof catalog)[number] => Boolean(opportunity));

  return (
    <>
      <SiteHeader />
      <main className="saved-page-wrapper">
        <section className="saved-page-header relative overflow-hidden">
          <MapleWatermark className="right-0 top-0 w-80 h-full text-[var(--maple-primary)]" opacity={0.06} />
          <div className="relative z-10">
            <Eyebrow>Your shortlist</Eyebrow>
            <h1 className="font-serif text-3xl font-bold text-[var(--ink-strong)]">Saved opportunities</h1>
            <p className="mt-2 text-sm sm:text-base text-[var(--ink-body)]">
              Keep promising scholarships, competitions, and internships in one place while you compare your next steps.
            </p>
          </div>
          <span className="saved-page-count relative z-10">
            {savedOpportunities.length} <small>Saved</small>
          </span>
        </section>

        <section className="saved-page-content" aria-labelledby="saved-list-heading">
          <div className="saved-page-section-heading">
            <div>
              <Eyebrow>Your list</Eyebrow>
              <h2 id="saved-list-heading" className="font-serif text-xl font-bold text-[var(--ink-strong)]">
                Active opportunities ({savedOpportunities.length})
              </h2>
            </div>
            <Link className="secondary-button" href="/opportunities">
              Find more opportunities <span aria-hidden="true">↗</span>
            </Link>
          </div>

          {savedOpportunities.length === 0 ? (
            <div className="saved-empty-state flex flex-col items-center text-center">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <MapleTreeEmblem className="w-20 h-20 opacity-75" />
              </div>
              <p>You haven’t saved any opportunities yet.</p>
              <Link className="primary-button" href="/opportunities">
                Explore catalog
              </Link>
            </div>
          ) : (
            <div className="saved-cards-grid">
              {savedOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  initialSaved={true}
                  isAuthenticated={Boolean(user)}
                  returnTo="/saved"
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
