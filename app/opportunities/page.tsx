import OpportunityDirectory from '../components/opportunity-directory';
import { SiteFooter, SiteHeader } from '../components/site-chrome';
import {
  opportunities,
  supportedOpportunityTypes,
  supportedProvinces,
  supportedStudyFocuses,
  type OpportunityType,
  type StudyFocus,
} from '../data/opportunities';
import { getSavedOpportunityState } from '@/lib/saved-opportunities';
import { getPublishedRoleOpportunities } from '@/lib/role-submissions';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const opportunityTypes: OpportunityType[] = supportedOpportunityTypes;
const grades = [9, 10, 11, 12];

function values(value: string | string[] | undefined) {
  return value === undefined ? [] : Array.isArray(value) ? value : [value];
}

export default async function OpportunitiesPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const { user, savedIds } = await getSavedOpportunityState();
  const publishedRoles = await getPublishedRoleOpportunities();
  const catalog = [...opportunities, ...publishedRoles];
  const initialTypes = values(query.type).filter((value): value is OpportunityType =>
    opportunityTypes.includes(value as OpportunityType),
  );
  const initialGrades = values(query.grade)
    .map(Number)
    .filter((grade) => grades.includes(grade));
  const initialProvinces = values(query.province).filter((prov) =>
    (supportedProvinces as readonly string[]).includes(prov),
  );
  const initialFocuses = values(query.focus).filter((focus): focus is StudyFocus =>
    (supportedStudyFocuses as readonly string[]).includes(focus),
  );

  return (
    <>
      <SiteHeader />
      <OpportunityDirectory
        catalog={catalog}
        initialSavedIds={savedIds}
        isAuthenticated={Boolean(user)}
        initialTypes={initialTypes}
        initialGrades={initialGrades}
        initialProvinces={initialProvinces}
        initialFocuses={initialFocuses}
      />
      <SiteFooter />
    </>
  );
}
