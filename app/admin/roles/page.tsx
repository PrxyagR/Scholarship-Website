import { notFound, redirect } from 'next/navigation';
import { AuthError, AuthShell } from '../../components/auth-shell';
import AdminRoleSubmissions from '../../components/admin-role-submissions';
import { listAdminRoleSubmissions } from '@/lib/role-submissions';
import { isConfiguredAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminRolesPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <AuthShell
        eyebrow="Owner dashboard"
        title="Role review is not connected"
        description="Add the server-only Supabase settings before using the private review queue."
      >
        <AuthError>Supabase is not configured for this site yet.</AuthError>
      </AuthShell>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in?next=/admin/roles');
  if (!isConfiguredAdmin(user)) notFound();

  const submissions = await listAdminRoleSubmissions('pending');
  return (
    <AuthShell
      eyebrow="Private owner dashboard"
      title="Review youth-role submissions"
      description="Approve only roles with a clear official source, current eligibility, and genuine access for Canadian high school students."
    >
      <div className="admin-role-intro">
        <span className="metric-label">Pending review</span>
        <strong>{submissions.length}</strong>
        <span className="metric-note">Approved roles appear in the public directory.</span>
      </div>
      <AdminRoleSubmissions initialSubmissions={submissions} />
      <div className="auth-links">
        <a href="/account">Back to account</a>
      </div>
    </AuthShell>
  );
}
