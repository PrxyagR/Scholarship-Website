import { notFound, redirect } from 'next/navigation';
import { AuthError, AuthShell } from '../../components/auth-shell';
import { countRegisteredUsers, isConfiguredAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function SignupMetricsPage() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <AuthShell
        eyebrow="Owner dashboard"
        title="Signup metrics are not connected"
        description="Add the server-only Supabase settings before using the private account dashboard."
      >
        <AuthError>Supabase is not configured for this site yet.</AuthError>
      </AuthShell>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in?next=/admin/signups');
  }

  if (!isConfiguredAdmin(user)) {
    notFound();
  }

  let metrics: Awaited<ReturnType<typeof countRegisteredUsers>> = null;
  let metricsError = false;

  try {
    metrics = await countRegisteredUsers();
  } catch {
    metricsError = true;
  }

  return (
    <AuthShell
      eyebrow="Private owner dashboard"
      title="MaplePath signup metrics"
      description="A simple, private snapshot of unique Supabase Auth accounts for project reporting."
    >
      {metricsError ? (
        <AuthError>
          The account count could not be loaded. Check that the server-only Supabase secret key is configured.
        </AuthError>
      ) : null}
      {!metricsError && !metrics ? (
        <AuthError>Set the server-only Supabase secret key to load signup metrics.</AuthError>
      ) : null}
      {metrics ? (
        <div className="metrics-grid" aria-label="Signup metrics">
          <div className="metric-card">
            <span className="metric-label">Registered accounts</span>
            <strong>{metrics.registered}</strong>
            <span className="metric-note">Unique Auth users created</span>
          </div>
          <div className="metric-card metric-card-accent">
            <span className="metric-label">Email-confirmed accounts</span>
            <strong>{metrics.confirmed}</strong>
            <span className="metric-note">Verified email accounts</span>
          </div>
        </div>
      ) : null}
      <div className="metrics-note">
        <strong>How to report this</strong>
        <p>
          Use the email-confirmed count when describing verified accounts, and include the date you checked it. This is an account metric, not a page-view or unique-visitor metric.
        </p>
      </div>
      <div className="auth-links">
        <a href="/account">Back to account</a>
      </div>
    </AuthShell>
  );
}
