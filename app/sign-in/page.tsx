import Link from 'next/link';
import { redirect } from 'next/navigation';
import { signIn, signInWithGoogle } from '../auth/actions';
import { AuthError, AuthField, AuthNotice, AuthShell } from '../components/auth-shell';
import { getSafeNextPath } from '@/lib/supabase/redirects';
import { createClient } from '@/lib/supabase/server';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function errorMessage(error: string | undefined) {
  switch (error) {
    case 'invalid':
      return 'That email and password combination did not work. If you just signed up, check your inbox for the confirmation email.';
    case 'confirm':
      return 'This confirmation link is invalid or expired. Request a new password or sign-up email and try again.';
    case 'consent':
      return 'Please accept the privacy notice to continue with Google.';
    case 'google':
      return 'Google sign-in is not available right now. Make sure the Google provider is enabled, then try again.';
    case 'setup':
      return 'Accounts are not connected to this deployment yet. Please try again after the site setup is complete.';
    default:
      return error ? 'We could not sign you in. Please try again.' : null;
  }
}

function signInPrompt(message: string | undefined) {
  switch (message) {
    case 'save-required':
      return 'Create a free account or sign in to keep your shortlist saved to your profile and available when you return.';
    case 'saved-required':
      return 'Your saved list is personal to you. Sign in to view it and keep changes synced to your account.';
    case 'dashboard-required':
      return 'Sign in to keep your application progress and private notes in your account, and to export saved deadlines to your calendar.';
    case 'roadmap-required':
      return 'Sign in to save a roadmap tailored to your grade and interests, then pick up where you left off later.';
    case 'submit-role-required':
      return 'Sign in to save your opportunity suggestion to your account and let MaplePath editors follow up if needed. Submissions stay private until reviewed.';
    case 'account-required':
      return 'Sign in to view your account details and access your MaplePath account tools.';
    case 'owner-required':
      return 'This area is reserved for authorized MaplePath project administrators. Sign in with the owner account to continue; a regular student account will not have access.';
    default:
      return null;
  }
}

export default async function SignInPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const next = getSafeNextPath(firstValue(query.next), '/account');
  const prompt = signInPrompt(firstValue(query.message));
  const message = errorMessage(firstValue(query.error));
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (user) redirect(next);

  const googleAction = signInWithGoogle.bind(null, next);
  const emailAction = signIn.bind(null, next);

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to MaplePath"
      description="Keep your directory experience ready for the next scholarship, competition, or internship worth pursuing."
    >
      {prompt ? <AuthNotice>{prompt}</AuthNotice> : null}
      {message ? <AuthError>{message}</AuthError> : null}
      <form className="auth-form" action={googleAction}>
        <label className="auth-checkbox">
          <input name="google_consent" type="checkbox" required />
          <span>
            I agree to the <Link href="/privacy">privacy notice</Link> and understand that Google will provide my basic account details to MaplePath.
          </span>
        </label>
        <button className="google-submit" type="submit">
          <span className="google-glyph" aria-hidden="true">G</span>
          Continue with Google
        </button>
      </form>
      <div className="auth-divider" aria-hidden="true">
        <span>or use email</span>
      </div>
      <form className="auth-form" action={emailAction}>
        <AuthField id="email" label="Email address" type="email" autoComplete="email" />
        <AuthField id="password" label="Password" type="password" autoComplete="current-password" />
        <button className="auth-submit" type="submit">
          Sign in <span aria-hidden="true">↗</span>
        </button>
      </form>
      <div className="auth-links">
        <Link href="/forgot-password">Forgot your password?</Link>
        <span>
          New to MaplePath?{' '}
          <Link href={`/sign-up?next=${encodeURIComponent(next)}`}>Create an account</Link>
        </span>
      </div>
    </AuthShell>
  );
}
