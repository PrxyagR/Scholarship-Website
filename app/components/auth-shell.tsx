import { Eyebrow, SiteFooter, SiteHeader } from './site-chrome';

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="auth-page">
        <div className="auth-shell">
          <div className="auth-intro">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <section className="auth-card" aria-label={title}>
            {children}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export function AuthError({ children }: { children: React.ReactNode }) {
  return (
    <p className="auth-message auth-error" role="alert">
      {children}
    </p>
  );
}

export function AuthSuccess({ children }: { children: React.ReactNode }) {
  return (
    <p className="auth-message auth-success" role="status">
      {children}
    </p>
  );
}

export function AuthField({
  id,
  label,
  type = 'text',
  autoComplete,
  required = true,
  hint,
}: {
  id: string;
  label: string;
  type?: 'email' | 'password' | 'text';
  autoComplete?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="auth-field" htmlFor={id}>
      <span className="auth-label">{label}</span>
      <input
        id={id}
        className="auth-input"
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        minLength={type === 'password' ? 8 : undefined}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
      {hint ? (
        <span className="auth-field-hint" id={`${id}-hint`}>
          {hint}
        </span>
      ) : null}
    </label>
  );
}
