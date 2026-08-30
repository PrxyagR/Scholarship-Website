import Link from 'next/link';
import { redirect } from 'next/navigation';
import { signOut } from '../auth/actions';
import { AuthError, AuthShell, AuthSuccess } from '../components/auth-shell';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function formatMemberSince(value: string) {
  return new Intl.DateTimeFormat('en-CA', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AccountPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const supabase = await createClient();

  if (!supabase) {
    return (
      <AuthShell
        eyebrow="Account setup"
        title="Your account is almost here"
        description="The public directory is ready to explore, but account services still need to be connected to this deployment."
      >
        <AuthError>Supabase is not configured for this site yet.</AuthError>
        <div className="auth-links">
          <Link href="/opportunities">Browse the directory</Link>
        </div>
      </AuthShell>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in?next=/account');
  }

  const adminEmail = process.env.SUPABASE_ADMIN_EMAIL?.trim().toLowerCase();
  const isAdmin = Boolean(adminEmail && user.email && user.email.toLowerCase() === adminEmail);

  return (
    <AuthShell
      eyebrow="Your MaplePath account"
      title="You’re signed in."
      description="Thanks for helping MaplePath grow into a more useful, student-first directory."
    >
      <div className="account-summary">
        <span className="account-summary-label">Signed in as</span>
        <strong>{user.email}</strong>
        <span className="account-summary-meta">Member since {formatMemberSince(user.created_at)}</span>
      </div>
      {isAdmin ? (
        <div className="account-admin-note">
          <strong>Project owner tools</strong>
          <p>View the private count of registered and email-confirmed accounts.</p>
          <a className="secondary-button" href="/admin/signups">
            Open signup metrics <span aria-hidden="true">↗</span>
          </a>
        </div>
      ) : null}
      <div className="account-actions">
        <Link className="primary-button" href="/opportunities">
          Explore opportunities <span aria-hidden="true">↗</span>
        </Link>
        <Link className="secondary-button" href="/saved">
          View saved opportunities
        </Link>
        <Link className="secondary-button" href="/forgot-password">
          Change password
        </Link>
        <form action={signOut}>
          <button className="account-signout" type="submit">
            Sign out
          </button>
        </form>
      </div>
      {firstValue(query.message) === 'password-updated' ? (
        <AuthSuccess>Your password was updated successfully.</AuthSuccess>
      ) : null}
    </AuthShell>
  );
}
