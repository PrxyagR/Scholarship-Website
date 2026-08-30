import OpportunityDirectory from '../components/opportunity-directory';
import { SiteFooter, SiteHeader } from '../components/site-chrome';
import { getSavedOpportunityState } from '@/lib/saved-opportunities';

export const dynamic = 'force-dynamic';

export default async function OpportunitiesPage() {
  const { user, savedIds } = await getSavedOpportunityState();

  return (
    <>
      <SiteHeader />
      <OpportunityDirectory initialSavedIds={savedIds} isAuthenticated={Boolean(user)} />
      <SiteFooter />
    </>
  );
}
