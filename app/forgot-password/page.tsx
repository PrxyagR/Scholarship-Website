import Link from 'next/link';
import { requestPasswordReset } from '../auth/actions';
import { AuthError, AuthField, AuthShell, AuthSuccess } from '../components/auth-shell';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ForgotPasswordPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const error = firstValue(query.error);
  const message = firstValue(query.message);

  return (
    <AuthShell
      eyebrow="Account help"
      title="Reset your password"
      description="Enter the email you use for MaplePath and we’ll send a secure reset link if an account exists."
    >
      {error === 'invalid-email' ? <AuthError>Enter a valid email address.</AuthError> : null}
      {error === 'setup' ? (
        <AuthError>Accounts are not connected to this deployment yet. Please try again after setup.</AuthError>
      ) : null}
      {message === 'sent' ? (
        <AuthSuccess>If an account exists for that address, a reset link is on its way.</AuthSuccess>
      ) : null}
      <form className="auth-form" action={requestPasswordReset}>
        <AuthField id="email" label="Email address" type="email" autoComplete="email" />
        <button className="auth-submit" type="submit">
          Send reset link <span aria-hidden="true">↗</span>
        </button>
      </form>
      <div className="auth-links">
        <Link href="/sign-in">Back to sign in</Link>
      </div>
    </AuthShell>
  );
}
