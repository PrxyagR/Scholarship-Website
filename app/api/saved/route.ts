import { type NextRequest, NextResponse } from 'next/server';
import { getSafeNextPath } from '@/lib/supabase/redirects';
import {
  addSavedOpportunity,
  getSavedOpportunityIds,
  isSaveableOpportunityId,
  removeSavedOpportunity,
  SAVED_OPPORTUNITIES_KEY,
} from '@/lib/saved-opportunities';
import { createClient } from '@/lib/supabase/server';

async function readPayload(request: NextRequest) {
  try {
    const body = await request.json();
    return {
      opportunityId: body?.opportunityId,
      returnTo: getSafeNextPath(body?.returnTo, '/opportunities'),
    };
  } catch {
    return { opportunityId: null, returnTo: '/opportunities' };
  }
}

function authRequired(returnTo: string) {
  return NextResponse.json(
    {
      error: 'auth_required',
      redirectTo: `/sign-in?message=save-required&next=${encodeURIComponent(returnTo)}`,
    },
    { status: 401 },
  );
}

async function getUserContext(request: NextRequest, returnTo: string) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return { response: NextResponse.json({ error: 'invalid_origin' }, { status: 403 }) };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { response: NextResponse.json({ error: 'setup' }, { status: 503 }) };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { response: authRequired(returnTo) };
  }

  return { supabase, user };
}

async function updateSavedState(request: NextRequest, shouldSave: boolean) {
  const { opportunityId, returnTo } = await readPayload(request);

  if (!isSaveableOpportunityId(opportunityId)) {
    return NextResponse.json({ error: 'unknown_opportunity' }, { status: 400 });
  }

  const context = await getUserContext(request, returnTo);
  if ('response' in context) return context.response;

  const currentIds = getSavedOpportunityIds(context.user);
  const savedIds = shouldSave
    ? addSavedOpportunity(currentIds, opportunityId)
    : removeSavedOpportunity(currentIds, opportunityId);

  const { error } = await context.supabase.auth.updateUser({
    data: {
      ...context.user.user_metadata,
      [SAVED_OPPORTUNITIES_KEY]: savedIds,
    },
  });

  if (error) {
    return NextResponse.json({ error: 'update_failed' }, { status: 500 });
  }

  return NextResponse.json({ saved: shouldSave, savedIds });
}

export async function POST(request: NextRequest) {
  return updateSavedState(request, true);
}

export async function DELETE(request: NextRequest) {
  return updateSavedState(request, false);
}
