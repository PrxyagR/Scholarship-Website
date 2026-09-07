import OpportunityDirectory from '../components/opportunity-directory';
import { SiteFooter, SiteHeader } from '../components/site-chrome';
import { type OpportunityType } from '../data/opportunities';
import { getSavedOpportunityState } from '@/lib/saved-opportunities';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const opportunityTypes: OpportunityType[] = ['Scholarship', 'Competition', 'Internship'];
const grades = [9, 10, 11, 12];

function values(value: string | string[] | undefined) {
  return value === undefined ? [] : Array.isArray(value) ? value : [value];
}

export default async function OpportunitiesPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const { user, savedIds } = await getSavedOpportunityState();
  const initialTypes = values(query.type).filter((value): value is OpportunityType =>
    opportunityTypes.includes(value as OpportunityType),
  );
  const initialGrades = values(query.grade)
    .map(Number)
    .filter((grade) => grades.includes(grade));

  return (
    <>
      <SiteHeader />
      <OpportunityDirectory
        initialSavedIds={savedIds}
        isAuthenticated={Boolean(user)}
        initialTypes={initialTypes}
        initialGrades={initialGrades}
      />
      <SiteFooter />
    </>
  );
}
