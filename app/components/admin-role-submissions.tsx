'use client';

import { useState } from 'react';
import type { AdminRoleSubmission } from '@/lib/role-submissions';

export default function AdminRoleSubmissions({ initialSubmissions }: { initialSubmissions: AdminRoleSubmission[] }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [busyId, setBusyId] = useState('');
  const [message, setMessage] = useState('');

  async function review(submission: AdminRoleSubmission, status: 'approved' | 'rejected') {
    setBusyId(submission.id);
    setMessage('');
    try {
      const response = await fetch('/api/admin/role-submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submitterUserId: submission.submitterUserId,
          submissionId: submission.id,
          status,
        }),
      });
      if (!response.ok) throw new Error('review failed');
      setSubmissions((current) => current.filter((item) => item.id !== submission.id));
      setMessage(status === 'approved' ? 'Role approved and added to the public catalog.' : 'Role rejected and removed from the queue.');
    } catch {
      setMessage('That review did not save. Please refresh and try again.');
    } finally {
      setBusyId('');
    }
  }

  if (!submissions.length) {
    return <p className="admin-empty-state">No pending role submissions right now.</p>;
  }

  return (
    <div className="admin-role-submissions">
      {message ? <p className="auth-message auth-success" role="status">{message}</p> : null}
      {submissions.map((submission) => (
        <article className="admin-role-card" key={`${submission.submitterUserId}-${submission.id}`}>
          <div className="admin-role-card-topline">
            <span className="card-type-badge badge-youth-role">＋ Youth role</span>
            <span>Submitted by {submission.submitterEmail}</span>
          </div>
          <h2>{submission.title}</h2>
          <p className="card-provider-text">{submission.provider}</p>
          <p>{submission.summary}</p>
          <div className="admin-role-facts">
            <span>{submission.locationLabel}</span>
            <span>Grades {submission.grades.join(' · ')}</span>
            <span>{submission.deadline.label}</span>
            <span>{submission.cost} · {submission.format}</span>
          </div>
          <p className="admin-role-eligibility"><strong>Eligibility:</strong> {submission.eligibility}</p>
          <div className="admin-role-links">
            <a className="text-link" href={submission.applyUrl} target="_blank" rel="noreferrer">Open official link ↗</a>
            <div className="admin-role-actions">
              <button className="secondary-button" type="button" disabled={busyId === submission.id} onClick={() => review(submission, 'rejected')}>Reject</button>
              <button className="primary-button" type="button" disabled={busyId === submission.id} onClick={() => review(submission, 'approved')}>Approve <span aria-hidden="true">↗</span></button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
