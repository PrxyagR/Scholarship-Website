import { type NextRequest, NextResponse } from 'next/server';

const DEFAULT_MAX_BODY_BYTES = 8 * 1024;

export function validateJsonMutation(
  request: NextRequest,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get('origin');
  const fetchSite = request.headers.get('sec-fetch-site');

  if (!origin || origin !== requestUrl.origin || (fetchSite && fetchSite !== 'same-origin')) {
    return NextResponse.json({ error: 'invalid_origin' }, { status: 403 });
  }

  const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/json') {
    return NextResponse.json({ error: 'unsupported_media_type' }, { status: 415 });
  }

  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > maxBodyBytes) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }

  return null;
}

export async function readJsonPayload(
  request: NextRequest,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
): Promise<{ body: unknown; response: null } | { body: null; response: NextResponse }> {
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > maxBodyBytes) {
      return {
        body: null,
        response: NextResponse.json({ error: 'payload_too_large' }, { status: 413 }),
      };
    }

    return { body: JSON.parse(rawBody) as unknown, response: null };
  } catch {
    return {
      body: null,
      response: NextResponse.json({ error: 'invalid_payload' }, { status: 400 }),
    };
  }
}
