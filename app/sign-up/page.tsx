import Link from 'next/link';
import { signInWithGoogle, signUp } from '../auth/actions';
import { AuthError, AuthField, AuthShell, AuthSuccess } from '../components/auth-shell';
import { getSafeNextPath } from '@/lib/supabase/redirects';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function errorMessage(error: string | undefined) {
  switch (error) {
    case 'invalid-email':
      return 'Enter a valid email address to create your account.';
    case 'password':
      return 'Use a password with at least 8 characters, and make sure both password fields match.';
    case 'consent':
      return 'Please read and accept the account and privacy notice to continue.';
    case 'setup':
      return 'Accounts are not connected to this deployment yet. Please try again after the site setup is complete.';
    default:
      return error ? 'We could not create your account. Please try again.' : null;
  }
}

export default async function SignUpPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const error = errorMessage(firstValue(query.error));
  const checkEmail = firstValue(query.message) === 'check-email';
  const next = getSafeNextPath(firstValue(query.next), '/account');

  return (
    <AuthShell
      eyebrow="Join the directory"
      title="Create your MaplePath account"
      description="Create one free account to save opportunities, get a personalized shortlist, export deadlines, and track your application progress."
    >
      {error ? <AuthError>{error}</AuthError> : null}
      {checkEmail ? (
        <AuthSuccess>
          Your account is almost ready. Check your inbox and click the confirmation link before signing in.
      </AuthSuccess>
      ) : null}
      <form className="auth-form" action={signInWithGoogle}>
        <input type="hidden" name="next" value={next} />
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
        <span>or create with email</span>
      </div>
      <form className="auth-form" action={signUp}>
        <input type="hidden" name="next" value={next} />
        <AuthField id="email" label="Email address" type="email" autoComplete="email" />
        <AuthField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters."
        />
        <AuthField
          id="password_confirmation"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
        />
        <label className="auth-checkbox">
          <input name="privacy_consent" type="checkbox" required />
          <span>
            I agree to create a MaplePath account and have read the{' '}
            <Link href="/privacy">privacy notice</Link>. I understand that my email is used for account access and unique registration measurement.
          </span>
        </label>
        <button className="auth-submit" type="submit">
          Create account <span aria-hidden="true">↗</span>
        </button>
      </form>
      <div className="auth-links">
        <span>
          Already have an account?{' '}
          <Link href={`/sign-in?next=${encodeURIComponent(next)}`}>Sign in</Link>
        </span>
      </div>
    </AuthShell>
  );
}
