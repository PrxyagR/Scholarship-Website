'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Opportunity } from '../data/opportunities';
import { OpportunityCard } from './opportunity-card';
import { Eyebrow } from './site-chrome';
import {
  getRecommendedOpportunities,
  studentFocusOptions,
  studentProvinceOptions,
  type ApplicationRecord,
  type ApplicationStatus,
  type ApplicationTracker,
  type StudentProfile,
} from '@/lib/student-tools';

function firstNameFromEmail(email: string) {
  const name = email.split('@')[0]?.replace(/[._-]+/g, ' ').trim();
  return name ? name.split(' ')[0] : 'there';
}

function escapeIcs(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function nextCalendarDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10).replaceAll('-', '');
}

function downloadCalendar(opportunitiesToExport: Opportunity[]) {
  const datedOpportunities = opportunitiesToExport.filter((opportunity) => opportunity.deadline.date);
  if (!datedOpportunities.length) return;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MaplePath//Student planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  for (const opportunity of datedOpportunities) {
    const date = opportunity.deadline.date!.replaceAll('-', '');
    const endDate = nextCalendarDate(opportunity.deadline.date!);
    lines.push(
      'BEGIN:VEVENT',
      `UID:${escapeIcs(opportunity.id)}@maplepath`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`,
      `DTSTART;VALUE=DATE:${date}`,
      `DTEND;VALUE=DATE:${endDate}`,
      `SUMMARY:${escapeIcs(`MaplePath deadline: ${opportunity.title}`)}`,
      `DESCRIPTION:${escapeIcs(`${opportunity.provider} · Official page: ${opportunity.applyUrl}`)}`,
      `URL:${opportunity.applyUrl}`,
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');
  const blob = new Blob([`${lines.join('\r\n')}\r\n`], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'maplepath-deadlines.ics';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

function recordFor(tracker: ApplicationTracker, opportunityId: string): ApplicationRecord {
  return tracker[opportunityId] ?? { status: 'Planning', note: '', updatedAt: '' };
}

function ApplicationRow({
  opportunity,
  record,
  onUpdate,
}: {
  opportunity: Opportunity;
  record: ApplicationRecord;
  onUpdate: (opportunityId: string, update: { status?: ApplicationStatus; note?: string }, persist?: boolean) => void;
}) {
  return (
    <article className="dashboard-opportunity-row">
      <div className="dashboard-opportunity-main">
        <span className="dashboard-opportunity-type">{opportunity.type}</span>
        <h3>
          <Link href={`/opportunities/${opportunity.id}`}>{opportunity.title}</Link>
        </h3>
        <p>{opportunity.provider}</p>
        <div className="dashboard-opportunity-meta">
          <span>{opportunity.deadline.label}</span>
          <span>{opportunity.locationLabel}</span>
        </div>
      </div>
      <label className="dashboard-status-field">
        <span>Status</span>
        <select
          className="dashboard-select"
          value={record.status}
          onChange={(event) => onUpdate(opportunity.id, { status: event.target.value as ApplicationStatus })}
        >
          <option>Planning</option>
          <option>In progress</option>
          <option>Submitted</option>
        </select>
      </label>
      <div className="dashboard-note-field">
        <label htmlFor={`note-${opportunity.id}`}>Private note</label>
        <textarea
          id={`note-${opportunity.id}`}
          className="dashboard-note-input"
          value={record.note}
          maxLength={500}
          placeholder="Add a reminder, question, or next step…"
          onChange={(event) => onUpdate(opportunity.id, { note: event.target.value }, false)}
          onBlur={(event) => onUpdate(opportunity.id, { note: event.target.value })}
        />
        <a className="dashboard-inline-link" href={opportunity.applyUrl} target="_blank" rel="noreferrer">
          Official page ↗
        </a>
      </div>
    </article>
  );
}

export default function StudentDashboard({
  userEmail,
  initialProfile,
  savedIds,
  savedOpportunities,
  initialTracker,
  initialRecommendations,
  catalog,
}: {
  userEmail: string;
  initialProfile: StudentProfile;
  savedIds: string[];
  savedOpportunities: Opportunity[];
  initialTracker: ApplicationTracker;
  initialRecommendations: Opportunity[];
  catalog: Opportunity[];
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [tracker, setTracker] = useState(initialTracker);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [trackerMessage, setTrackerMessage] = useState('');

  const recommendations = useMemo(
    () => getRecommendedOpportunities(profile, savedIds, catalog),
    [profile, savedIds, catalog],
  );
  const visibleRecommendations = recommendations.length ? recommendations : initialRecommendations;
  const datedSavedCount = savedOpportunities.filter((opportunity) => opportunity.deadline.date).length;
  const profileReady = Boolean(profile.grade && profile.focuses.length);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProfile(true);
    setProfileMessage('');

    try {
      const response = await fetch('/api/student-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });
      const payload = (await response.json().catch(() => null)) as { redirectTo?: unknown } | null;
      if (response.status === 401 && typeof payload?.redirectTo === 'string') {
        window.location.assign(payload.redirectTo);
        return;
      }
      if (!response.ok) throw new Error('profile update failed');
      setProfileMessage('Saved. Your recommendations are updated for this session.');
    } catch {
      setProfileMessage('We could not save those preferences. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function updateApplication(
    opportunityId: string,
    update: { status?: ApplicationStatus; note?: string },
    persist = true,
  ) {
    const previous = tracker;
    const current = recordFor(tracker, opportunityId);
    const nextRecord = {
      ...current,
      ...update,
      updatedAt: new Date().toISOString(),
    };
    setTracker((currentTracker) => ({ ...currentTracker, [opportunityId]: nextRecord }));
    setTrackerMessage('');
    if (!persist) return;

    try {
      const response = await fetch('/api/application-tracker', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId, ...nextRecord }),
      });
      const payload = (await response.json().catch(() => null)) as { redirectTo?: unknown } | null;
      if (response.status === 401 && typeof payload?.redirectTo === 'string') {
        window.location.assign(payload.redirectTo);
        return;
      }
      if (!response.ok) throw new Error('tracker update failed');
    } catch {
      setTracker(previous);
      setTrackerMessage('One update did not save. Please try again.');
    }
  }

  return (
    <main className="dashboard-page-wrapper">
      <section className="dashboard-header">
        <div>
          <Eyebrow>Student dashboard</Eyebrow>
          <h1>Build your opportunity plan.</h1>
          <p>
            Welcome, {firstNameFromEmail(userEmail)}. Keep your shortlist, deadlines, and application progress together.
          </p>
        </div>
        <div className="dashboard-account-chip">
          <span>Signed in as</span>
          <strong>{userEmail}</strong>
        </div>
      </section>

      <div className="dashboard-body">
        <div className="dashboard-top-grid">
          <section className="dashboard-panel dashboard-profile-panel" aria-labelledby="profile-heading">
            <div className="dashboard-panel-heading">
              <div>
                <Eyebrow>Personalize</Eyebrow>
                <h2 id="profile-heading">Your student profile</h2>
              </div>
              <span className="dashboard-private-label">Private to you</span>
            </div>
            <p className="dashboard-panel-intro">
              Add a grade and a few interests so MaplePath can put the most relevant opportunities first.
            </p>
            <form className="dashboard-profile-form" onSubmit={saveProfile}>
              <div className="dashboard-form-grid">
                <label className="dashboard-field">
                  <span>Current grade</span>
                  <select
                    className="dashboard-select"
                    value={profile.grade ?? ''}
                    onChange={(event) =>
                      setProfile((current) => ({
                        ...current,
                        grade: event.target.value ? Number(event.target.value) : null,
                      }))
                    }
                  >
                    <option value="">Choose a grade</option>
                    {[9, 10, 11, 12].map((grade) => (
                      <option key={grade} value={grade}>
                        Grade {grade}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="dashboard-field">
                  <span>Province or territory</span>
                  <select
                    className="dashboard-select"
                    value={profile.province}
                    onChange={(event) => setProfile((current) => ({ ...current, province: event.target.value }))}
                  >
                    <option value="">Choose a province</option>
                    {studentProvinceOptions.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <fieldset className="dashboard-focus-fieldset">
                <legend>Study focus <span>(choose any that fit)</span></legend>
                <div className="dashboard-focus-grid">
                  {studentFocusOptions.map((focus) => {
                    const checked = profile.focuses.includes(focus);
                    return (
                      <label className={`dashboard-focus-chip${checked ? ' is-selected' : ''}`} key={focus}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setProfile((current) => ({
                              ...current,
                              focuses: checked
                                ? current.focuses.filter((item) => item !== focus)
                                : [...current.focuses, focus],
                            }))
                          }
                        />
                        <span>{focus}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="dashboard-profile-actions">
                <button className="primary-button" type="submit" disabled={savingProfile}>
                  {savingProfile ? 'Saving…' : 'Save preferences'} <span aria-hidden="true">↗</span>
                </button>
                <span className="dashboard-save-message" role="status">
                  {profileMessage}
                </span>
              </div>
            </form>
          </section>

          <section className="dashboard-panel dashboard-calendar-panel" aria-labelledby="calendar-heading">
            <div className="dashboard-panel-heading">
              <div>
                <Eyebrow>Stay ahead</Eyebrow>
                <h2 id="calendar-heading">Your deadline calendar</h2>
              </div>
              <span className="dashboard-calendar-icon" aria-hidden="true">◷</span>
            </div>
            <div className="dashboard-calendar-stat">
              <strong>{datedSavedCount}</strong>
              <span>saved opportunities with a dated deadline</span>
            </div>
            <p className="dashboard-panel-intro">
              Export your saved dates to Google Calendar, Apple Calendar, or any app that accepts an .ics file.
            </p>
            <button
              className="secondary-button dashboard-calendar-button"
              type="button"
              onClick={() => downloadCalendar(savedOpportunities)}
              disabled={!datedSavedCount}
            >
              Download .ics calendar <span aria-hidden="true">↓</span>
            </button>
            {!datedSavedCount ? <p className="dashboard-helper-text">Save an opportunity with a dated deadline to enable the export.</p> : null}
          </section>
        </div>

        <section className="dashboard-panel dashboard-tracker-panel" aria-labelledby="tracker-heading">
          <div className="dashboard-panel-heading dashboard-panel-heading-wide">
            <div>
              <Eyebrow>Keep moving</Eyebrow>
              <h2 id="tracker-heading">Application tracker</h2>
              <p className="dashboard-panel-intro">Use a simple status and private note for every saved opportunity.</p>
            </div>
            <Link className="secondary-button" href="/saved">Manage saved list <span aria-hidden="true">↗</span></Link>
          </div>
          {trackerMessage ? <p className="dashboard-tracker-message" role="alert">{trackerMessage}</p> : null}
          {savedOpportunities.length ? (
            <div className="dashboard-opportunity-list">
              {savedOpportunities.map((opportunity) => (
                <ApplicationRow
                  key={opportunity.id}
                  opportunity={opportunity}
                  record={recordFor(tracker, opportunity.id)}
                  onUpdate={updateApplication}
                />
              ))}
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <span className="dashboard-empty-icon" aria-hidden="true">♡</span>
              <h3>Start with a shortlist</h3>
              <p>Save an opportunity from the catalog and it will appear here with its own progress tracker.</p>
              <Link className="primary-button" href="/opportunities">Explore the catalog <span aria-hidden="true">↗</span></Link>
            </div>
          )}
        </section>

        <section className="dashboard-recommendations" aria-labelledby="recommendations-heading">
          <div className="dashboard-section-heading">
            <div>
              <Eyebrow>{profileReady ? 'Matched to your profile' : 'A starting shortlist'}</Eyebrow>
              <h2 id="recommendations-heading">Opportunities to explore next</h2>
              <p>{profileReady ? 'Based on your grade and study focus. Save the ones worth pursuing.' : 'Add your grade and study focus above for more personal matches.'}</p>
            </div>
            <Link className="text-link" href="/opportunities">See the full catalog <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="opportunities-grid">
            {visibleRecommendations.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                initialSaved={savedIds.includes(opportunity.id)}
                isAuthenticated
                returnTo="/dashboard"
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
