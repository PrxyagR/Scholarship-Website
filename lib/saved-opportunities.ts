import type { User } from '@supabase/supabase-js';
import { opportunities } from '@/app/data/opportunities';
import { createClient } from '@/lib/supabase/server';

export const SAVED_OPPORTUNITIES_KEY = 'maplepath_saved_opportunity_ids';
const MAX_SAVED_OPPORTUNITIES = 250;

function isKnownOpportunityId(value: unknown): value is string {
  return typeof value === 'string' && opportunities.some((opportunity) => opportunity.id === value);
}

export function getSavedOpportunityIds(user: User | null | undefined) {
  const value = user?.user_metadata?.[SAVED_OPPORTUNITIES_KEY];
  if (!Array.isArray(value)) return [];

  return Array.from(new Set(value.filter(isKnownOpportunityId))).slice(0, MAX_SAVED_OPPORTUNITIES);
}

export async function getSavedOpportunityState() {
  const supabase = await createClient();
  if (!supabase) {
    return { user: null, savedIds: [] as string[] };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    user,
    savedIds: getSavedOpportunityIds(user),
  };
}

export function isSaveableOpportunityId(value: unknown): value is string {
  return isKnownOpportunityId(value);
}

export function addSavedOpportunity(savedIds: string[], opportunityId: string) {
  return Array.from(new Set([opportunityId, ...savedIds.filter(isKnownOpportunityId)])).slice(
    0,
    MAX_SAVED_OPPORTUNITIES,
  );
}

export function removeSavedOpportunity(savedIds: string[], opportunityId: string) {
  return savedIds.filter((savedId) => savedId !== opportunityId && isKnownOpportunityId(savedId));
}
