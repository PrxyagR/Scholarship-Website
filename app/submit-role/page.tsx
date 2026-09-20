import { redirect } from 'next/navigation';
import { AuthError, AuthShell } from '../components/auth-shell';
import RoleSubmissionForm from '../components/role-submission-form';
import { SiteFooter, SiteHeader } from '../components/site-chrome';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function SubmitRolePage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <AuthShell
        eyebrow="Suggest a youth role"
        title="Role submissions are almost here"
        description="Account services still need to be connected before MaplePath can receive private submissions."
      >
        <AuthError>Supabase is not configured for this site yet.</AuthError>
      </AuthShell>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in?message=submit-role-required&next=/submit-role');

  return (
    <>
      <SiteHeader />
      <main className="submission-page-wrapper">
        <section className="submission-page-intro">
          <div>
            <span className="eyebrow"><span className="eyebrow-dot" />For organizations and students</span>
            <h1>Know a role worth sharing?</h1>
            <p>Help us grow the youth-role directory. Every submission stays private until it passes a manual MaplePath review.</p>
          </div>
          <div className="submission-review-note">
            <strong>What we check</strong>
            <span>Official link · student eligibility · Canada access · current availability</span>
          </div>
        </section>
        <RoleSubmissionForm />
      </main>
      <SiteFooter />
    </>
  );
}
