import Link from 'next/link';
import { redirect } from 'next/navigation';
import { signOut } from '../auth/actions';
import { AuthError, AuthShell, AuthSuccess } from '../components/auth-shell';
import { createClient } from '@/lib/supabase/server';
import { isConfiguredAdmin } from '@/lib/supabase/admin';

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

  const isAdmin = isConfiguredAdmin(user);

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
          <p>View signup metrics and review role submissions before they appear publicly.</p>
          <a className="secondary-button" href="/admin/signups">
            Open signup metrics <span aria-hidden="true">↗</span>
          </a>
          <a className="secondary-button" href="/admin/roles">
            Review role submissions <span aria-hidden="true">↗</span>
          </a>
        </div>
      ) : null}
      <div className="account-actions">
        <Link className="primary-button" href="/dashboard">
          Open student dashboard <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="account-nav-grid">
        <Link className="account-nav-card" href="/roadmap">
          <strong>Student Roadmap <span aria-hidden="true">↗</span></strong>
          <span>Turn your interests into a 4-step actionable plan</span>
        </Link>
        <Link className="account-nav-card" href="/saved">
          <strong>Saved Shortlist <span aria-hidden="true">↗</span></strong>
          <span>View and compare your saved opportunities</span>
        </Link>
        <Link className="account-nav-card" href="/opportunities">
          <strong>Explore Catalog <span aria-hidden="true">↗</span></strong>
          <span>Filter scholarships, contests & internships</span>
        </Link>
        <Link className="account-nav-card" href="/forgot-password">
          <strong>Security & Password <span aria-hidden="true">↗</span></strong>
          <span>Update your password and credentials</span>
        </Link>
      </div>

      <form action={signOut} style={{ marginTop: '16px' }}>
        <button className="account-signout" type="submit">
          Sign out
        </button>
      </form>
      {firstValue(query.message) === 'password-updated' ? (
        <AuthSuccess>Your password was updated successfully.</AuthSuccess>
      ) : null}
    </AuthShell>
  );
}
