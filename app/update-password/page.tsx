import Link from 'next/link';
import { updatePassword } from '../auth/actions';
import { AuthError, AuthField, AuthShell } from '../components/auth-shell';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function UpdatePasswordPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const error = firstValue(query.error);

  return (
    <AuthShell
      eyebrow="Account help"
      title="Choose a new password"
      description="Set a new password for your MaplePath account, then continue exploring the directory."
    >
      {error === 'password' ? (
        <AuthError>Use at least 8 characters, and make sure both password fields match.</AuthError>
      ) : null}
      {error === 'setup' || error === 'generic' ? (
        <AuthError>We could not update your password. Request a fresh reset link and try again.</AuthError>
      ) : null}
      <form className="auth-form" action={updatePassword}>
        <AuthField id="password" label="New password" type="password" autoComplete="new-password" />
        <AuthField
          id="password_confirmation"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
        />
        <button className="auth-submit" type="submit">
          Update password <span aria-hidden="true">↗</span>
        </button>
      </form>
      <div className="auth-links">
        <Link href="/sign-in">Back to sign in</Link>
      </div>
    </AuthShell>
  );
}
