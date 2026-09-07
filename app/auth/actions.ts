'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSiteUrl } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';
import { getSafeNextPath } from '@/lib/supabase/redirects';

const MIN_PASSWORD_LENGTH = 8;
const CONSENT_VERSION = '2026-08-29';

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function readEmail(formData: FormData) {
  return readString(formData, 'email').trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getNext(value: string) {
  return getSafeNextPath(value, '/account');
}

export async function signIn(nextPath: string, formData: FormData) {
  const email = readEmail(formData);
  const password = readString(formData, 'password');
  const next = getNext(nextPath);

  if (!isValidEmail(email) || !password) {
    redirect(`/sign-in?error=invalid&next=${encodeURIComponent(next)}`);
  }

  const supabase = await createClient();
  if (!supabase) {
    redirect(`/sign-in?error=setup&next=${encodeURIComponent(next)}`);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/sign-in?error=invalid&next=${encodeURIComponent(next)}`);
  }

  revalidatePath('/', 'layout');
  redirect(next);
}

export async function signInWithGoogle(nextPath: string, formData: FormData) {
  const consent = readString(formData, 'google_consent');
  const next = getNext(nextPath);

  if (consent !== 'on') {
    redirect(`/sign-in?error=consent&next=${encodeURIComponent(next)}`);
  }

  const supabase = await createClient();
  if (!supabase) {
    redirect(`/sign-in?error=setup&next=${encodeURIComponent(next)}`);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback?provider=google&next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) {
    redirect(`/sign-in?error=google&next=${encodeURIComponent(next)}`);
  }

  redirect(data.url);
}

export async function signUp(nextPath: string, formData: FormData) {
  const email = readEmail(formData);
  const password = readString(formData, 'password');
  const passwordConfirmation = readString(formData, 'password_confirmation');
  const consent = readString(formData, 'privacy_consent');
  const next = getNext(nextPath);

  if (!isValidEmail(email)) {
    redirect(`/sign-up?error=invalid-email&next=${encodeURIComponent(next)}`);
  }

  if (password.length < MIN_PASSWORD_LENGTH || password !== passwordConfirmation) {
    redirect(`/sign-up?error=password&next=${encodeURIComponent(next)}`);
  }

  if (consent !== 'on') {
    redirect(`/sign-up?error=consent&next=${encodeURIComponent(next)}`);
  }

  const supabase = await createClient();
  if (!supabase) {
    redirect(`/sign-up?error=setup&next=${encodeURIComponent(next)}`);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/confirm?next=${encodeURIComponent(next)}`,
      data: {
        maplepath_consent: true,
        consent_version: CONSENT_VERSION,
      },
    },
  });

  if (error) {
    redirect('/sign-up?error=generic');
  }

  revalidatePath('/', 'layout');

  if (data.session) {
    redirect(next);
  }

  redirect(`/sign-up?message=check-email&next=${encodeURIComponent(next)}`);
}

export async function requestPasswordReset(formData: FormData) {
  const email = readEmail(formData);

  if (!isValidEmail(email)) {
    redirect('/forgot-password?error=invalid-email');
  }

  const supabase = await createClient();
  if (!supabase) {
    redirect('/forgot-password?error=setup');
  }

  // Always use the same success response for valid-looking emails so this form
  // does not reveal whether an address has an account.
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/update-password`,
  });

  redirect('/forgot-password?message=sent');
}

export async function updatePassword(formData: FormData) {
  const password = readString(formData, 'password');
  const passwordConfirmation = readString(formData, 'password_confirmation');

  if (password.length < MIN_PASSWORD_LENGTH || password !== passwordConfirmation) {
    redirect('/update-password?error=password');
  }

  const supabase = await createClient();
  if (!supabase) {
    redirect('/update-password?error=setup');
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect('/update-password?error=generic');
  }

  redirect('/account?message=password-updated');
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
