import Link from 'next/link';
import { signIn } from '../auth/actions';
import { AuthError, AuthField, AuthShell } from '../components/auth-shell';
import { getSafeNextPath } from '@/lib/supabase/redirects';

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
    case 'save-required':
      return 'Sign in or create a free account to save opportunities. We’ll bring you back after you sign in.';
    case 'saved-required':
      return 'Sign in to view the opportunities you have saved.';
    case 'dashboard-required':
      return 'Create a free account or sign in to use your private student dashboard, deadline calendar, and application tracker.';
    case 'setup':
      return 'Accounts are not connected to this deployment yet. Please try again after the site setup is complete.';
    default:
      return error ? 'We could not sign you in. Please try again.' : null;
  }
}

export default async function SignInPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const next = getSafeNextPath(firstValue(query.next), '/account');
  const message = errorMessage(firstValue(query.error));

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to MaplePath"
      description="Keep your directory experience ready for the next scholarship, competition, or internship worth pursuing."
    >
      {message ? <AuthError>{message}</AuthError> : null}
      <form className="auth-form" action={signIn}>
        <input type="hidden" name="next" value={next} />
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
