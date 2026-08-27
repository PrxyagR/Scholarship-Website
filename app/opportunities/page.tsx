import OpportunityDirectory from '../components/opportunity-directory';
import { SiteFooter, SiteHeader } from '../components/site-chrome';

export default function OpportunitiesPage() {
  return (
    <>
      <SiteHeader />
      <OpportunityDirectory />
      <SiteFooter />
    </>
  );
}
