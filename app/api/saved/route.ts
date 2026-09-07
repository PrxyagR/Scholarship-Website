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
import { readJsonPayload, validateJsonMutation } from '@/lib/request-security';

const MAX_REQUEST_BYTES = 4 * 1024;

async function readPayload(request: NextRequest) {
  const payload = await readJsonPayload(request, MAX_REQUEST_BYTES);
  if (payload.response) return { response: payload.response };

  const body = payload.body as { opportunityId?: unknown; returnTo?: unknown } | null;
  return {
    opportunityId: body?.opportunityId,
    returnTo: getSafeNextPath(
      typeof body?.returnTo === 'string' ? body.returnTo : undefined,
      '/opportunities',
    ),
  };
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

async function getUserContext(returnTo: string) {
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
  const unsafeRequest = validateJsonMutation(request, MAX_REQUEST_BYTES);
  if (unsafeRequest) return unsafeRequest;

  const payload = await readPayload(request);
  if ('response' in payload) return payload.response;
  const { opportunityId, returnTo } = payload;

  if (!isSaveableOpportunityId(opportunityId)) {
    return NextResponse.json({ error: 'unknown_opportunity' }, { status: 400 });
  }

  const context = await getUserContext(returnTo);
  if ('response' in context) return context.response;

  const currentIds = getSavedOpportunityIds(context.user);
  const savedIds = shouldSave
    ? addSavedOpportunity(currentIds, opportunityId)
    : removeSavedOpportunity(currentIds, opportunityId);

  const { error } = await context.supabase.auth.updateUser({
    data: {
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
