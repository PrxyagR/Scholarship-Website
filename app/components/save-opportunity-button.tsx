'use client';

import { useState } from 'react';

export function SaveOpportunityButton({
  opportunityId,
  opportunityTitle,
  initialSaved = false,
  isAuthenticated = false,
  returnTo = '/opportunities',
}: {
  opportunityId: string;
  opportunityTitle: string;
  initialSaved?: boolean;
  isAuthenticated?: boolean;
  returnTo?: string;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const signInUrl = `/sign-in?message=save-required&next=${encodeURIComponent(returnTo)}`;

  const handleSave = async () => {
    if (pending) return;

    if (!isAuthenticated) {
      window.location.assign(signInUrl);
      return;
    }

    setPending(true);
    setError(false);

    try {
      const response = await fetch('/api/saved', {
        method: saved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId, returnTo }),
      });
      const payload = await response.json().catch(() => null);

      if (response.status === 401 && payload?.redirectTo) {
        window.location.assign(payload.redirectTo);
        return;
      }

      if (!response.ok) {
        setError(true);
        return;
      }

      const nextSaved = Boolean(payload?.saved);
      setSaved(nextSaved);

      if (!nextSaved && window.location.pathname === '/saved') {
        window.location.reload();
      }
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <span className="save-opportunity-control">
      <button
        className={`save-opportunity-button${saved ? ' is-saved' : ''}`}
        type="button"
        aria-pressed={saved}
        aria-label={saved ? `Remove ${opportunityTitle} from saved opportunities` : `Save ${opportunityTitle}`}
        onClick={handleSave}
        disabled={pending}
      >
        <span className="save-opportunity-icon" aria-hidden="true">
          {saved ? '♥' : '♡'}
        </span>
        <span>{pending ? 'Saving…' : saved ? 'Saved' : 'Save'}</span>
      </button>
      {error ? (
        <span className="save-opportunity-error" role="alert">
          Try again
        </span>
      ) : null}
    </span>
  );
}
