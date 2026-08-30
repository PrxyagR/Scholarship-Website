import { AuthShell } from '../components/auth-shell';

export default function PrivacyPage() {
  return (
    <AuthShell
      eyebrow="Privacy notice"
      title="A small account, with a clear purpose."
      description="MaplePath asks for very little information so students can use the directory without a paywall or a complicated profile."
    >
      <div className="privacy-copy">
        <h2>What we collect</h2>
        <p>
          When you create an account, MaplePath stores your email address, account creation time, and the authentication records needed to sign you in securely. We do not ask for your school, grade, home address, date of birth, or application materials.
        </p>
        <h2>Why we collect it</h2>
        <p>
          Your email lets Supabase Authentication create and protect your account. The MaplePath app only exposes aggregate signup totals to the project owner; Supabase project administrators can manage the underlying authentication records. The totals let MaplePath’s reach be reported honestly.
        </p>
        <h2>What we do not do</h2>
        <p>
          MaplePath does not sell account information, use it to submit applications, or make application decisions. Official applications always happen on the opportunity provider’s own website.
        </p>
        <h2>Your responsibility</h2>
        <p>
          Use an email address you are allowed to use for this service. If you are under the age where your consent is required in your jurisdiction, ask a parent or guardian before creating an account. Do not put sensitive personal information into any MaplePath form.
        </p>
        <p className="privacy-last-updated">Last updated August 29, 2026.</p>
      </div>
    </AuthShell>
  );
}
