'use client';

import { useState } from 'react';
import {
  supportedOrganizerCountries,
  supportedProvinces,
  type LocationMode,
  type OpportunityCost,
  type OpportunityFormat,
  type OrganizerCountry,
  type StudyFocus,
} from '../data/opportunities';
import { studentFocusOptions } from '@/lib/student-tools';
import { Eyebrow } from './site-chrome';

const gradeOptions = [9, 10, 11, 12];
const costOptions: OpportunityCost[] = ['Free', 'Paid', 'Varies'];
const formatOptions: OpportunityFormat[] = ['Online', 'In person', 'Hybrid'];
const locationOptions: LocationMode[] = ['Canada', 'Online', 'Worldwide'];
const submissionFocusOptions: StudyFocus[] = [...studentFocusOptions, 'Any field'];
const deadlineOptions = [
  { value: 'rolling', label: 'Rolling / ongoing' },
  { value: 'date', label: 'Specific deadline' },
  { value: 'cycle', label: 'Next cycle / annual' },
] as const;

function fieldError(error: string) {
  if (error === 'expired_deadline') return 'Please use a current or future deadline.';
  if (error === 'submission_limit') return 'You have reached the submission limit for this account.';
  if (error === 'invalid_submission') return 'Please complete every required field and use an official HTTPS link.';
  return 'We could not send this role for review. Please try again.';
}

export default function RoleSubmissionForm() {
  const [grades, setGrades] = useState<number[]>([9, 10, 11, 12]);
  const [focuses, setFocuses] = useState<StudyFocus[]>(['Any field']);
  const [deadlineKind, setDeadlineKind] = useState<(typeof deadlineOptions)[number]['value']>('rolling');
  const [cost, setCost] = useState<OpportunityCost>('Free');
  const [format, setFormat] = useState<OpportunityFormat>('Hybrid');
  const [locationMode, setLocationMode] = useState<LocationMode>('Canada');
  const [organizerCountry, setOrganizerCountry] = useState<OrganizerCountry>('Canada');
  const [travelRequired, setTravelRequired] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  function toggleValue<T>(value: T, setter: React.Dispatch<React.SetStateAction<T[]>>) {
    setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setError('');
    const form = new FormData(event.currentTarget);
    const deadlineDate = String(form.get('deadlineDate') ?? '').trim();
    const body = {
      title: form.get('title'),
      provider: form.get('provider'),
      summary: form.get('summary'),
      eligibility: form.get('eligibility'),
      grades,
      studyFocus: focuses,
      province: form.get('province'),
      city: form.get('city'),
      locationMode,
      locationLabel: form.get('locationLabel'),
      deadline: {
        kind: deadlineKind,
        date: deadlineDate || undefined,
        label: form.get('deadlineLabel'),
      },
      applyUrl: form.get('applyUrl'),
      cost,
      format,
      organizerCountry,
      travelRequired,
    };

    if (!grades.length || !focuses.length) {
      setStatus('error');
      setError('Choose at least one eligible grade and one study focus.');
      return;
    }

    try {
      const response = await fetch('/api/role-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: unknown; redirectTo?: unknown };
      if (response.status === 401 && typeof result.redirectTo === 'string') {
        window.location.assign(result.redirectTo);
        return;
      }
      if (!response.ok) throw new Error(typeof result.error === 'string' ? result.error : 'submit_failed');
      setStatus('success');
      event.currentTarget.reset();
      setGrades([9, 10, 11, 12]);
      setFocuses(['Any field']);
      setDeadlineKind('rolling');
      setCost('Free');
      setFormat('Hybrid');
      setLocationMode('Canada');
      setOrganizerCountry('Canada');
      setTravelRequired(false);
    } catch (submissionError) {
      setStatus('error');
      setError(fieldError(submissionError instanceof Error ? submissionError.message : ''));
    }
  }

  return (
    <form className="role-submission-form" onSubmit={submit}>
      <div className="submission-section-heading">
        <Eyebrow>Role details</Eyebrow>
        <h2>Tell us about the opportunity</h2>
        <p>Submit a youth role, volunteer position, mentorship, or student leadership opening that Canadian high school students can access.</p>
      </div>

      {status === 'success' ? (
        <div className="auth-message auth-success" role="status">
          Thanks — your role is in the private review queue. It will only appear publicly after MaplePath verifies and approves it.
        </div>
      ) : null}
      {status === 'error' ? <div className="auth-message auth-error" role="alert">{error}</div> : null}

      <div className="submission-form-grid">
        <label className="dashboard-field">
          <span>Role or opportunity title</span>
          <input className="dashboard-input" name="title" required maxLength={120} placeholder="Youth advisory council member" />
        </label>
        <label className="dashboard-field">
          <span>Organization</span>
          <input className="dashboard-input" name="provider" required maxLength={120} placeholder="Organization name" />
        </label>
      </div>

      <label className="dashboard-field">
        <span>Short summary</span>
        <textarea className="dashboard-note-input submission-textarea" name="summary" required maxLength={600} placeholder="What would a student do, learn, or contribute?" />
      </label>
      <label className="dashboard-field">
        <span>Eligibility notes</span>
        <textarea className="dashboard-note-input submission-textarea" name="eligibility" required maxLength={800} placeholder="Who can apply? Include age, grade, residency, nomination, or school requirements." />
      </label>

      <fieldset className="submission-fieldset">
        <legend>Eligible grades</legend>
        <div className="submission-chip-grid">
          {gradeOptions.map((grade) => {
            const checked = grades.includes(grade);
            return (
              <label className={`submission-chip${checked ? ' is-selected' : ''}`} key={grade}>
                <input type="checkbox" checked={checked} onChange={() => toggleValue(grade, setGrades)} />
                <span>Grade {grade}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="submission-fieldset">
        <legend>Study focus</legend>
        <div className="submission-chip-grid">
          {submissionFocusOptions.map((focus) => {
            const checked = focuses.includes(focus);
            return (
              <label className={`submission-chip${checked ? ' is-selected' : ''}`} key={focus}>
                <input type="checkbox" checked={checked} onChange={() => toggleValue(focus, setFocuses)} />
                <span>{focus}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="submission-form-grid submission-form-grid-three">
        <label className="dashboard-field">
          <span>Province / coverage</span>
          <select className="dashboard-select" name="province" defaultValue="National" required>
            {supportedProvinces.map((province) => <option key={province}>{province}</option>)}
          </select>
        </label>
        <label className="dashboard-field">
          <span>City or area</span>
          <input className="dashboard-input" name="city" required maxLength={100} placeholder="Edmonton or Online" />
        </label>
        <label className="dashboard-field">
          <span>Access mode</span>
          <select className="dashboard-select" value={locationMode} onChange={(event) => setLocationMode(event.target.value as LocationMode)}>
            {locationOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
      </div>
      <label className="dashboard-field">
        <span>Location label</span>
        <input className="dashboard-input" name="locationLabel" required maxLength={160} placeholder="Online across Canada · summer 2027" />
      </label>

      <div className="submission-form-grid submission-form-grid-three">
        <label className="dashboard-field">
          <span>Availability</span>
          <select className="dashboard-select" value={deadlineKind} onChange={(event) => setDeadlineKind(event.target.value as typeof deadlineKind)}>
            {deadlineOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label className="dashboard-field">
          <span>Deadline date {deadlineKind === 'date' ? '' : '(optional)'}</span>
          <input className="dashboard-input" name="deadlineDate" type="date" required={deadlineKind === 'date'} />
        </label>
        <label className="dashboard-field">
          <span>Deadline label</span>
          <input className="dashboard-input" name="deadlineLabel" required maxLength={160} placeholder="Rolling applications" />
        </label>
      </div>

      <div className="submission-form-grid submission-form-grid-three">
        <label className="dashboard-field">
          <span>Cost</span>
          <select className="dashboard-select" value={cost} onChange={(event) => setCost(event.target.value as OpportunityCost)}>
            {costOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label className="dashboard-field">
          <span>Format</span>
          <select className="dashboard-select" value={format} onChange={(event) => setFormat(event.target.value as OpportunityFormat)}>
            {formatOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label className="dashboard-field">
          <span>Organizer country</span>
          <select className="dashboard-select" value={organizerCountry} onChange={(event) => setOrganizerCountry(event.target.value as OrganizerCountry)}>
            {supportedOrganizerCountries.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
      </div>

      <label className="dashboard-field">
        <span>Official application or information URL</span>
        <input className="dashboard-input" name="applyUrl" type="url" required pattern="https://.*" placeholder="https://example.org/apply" />
      </label>

      <label className="submission-checkbox-line">
        <input type="checkbox" checked={travelRequired} onChange={(event) => setTravelRequired(event.target.checked)} />
        <span>Travel may be required for an in-person finalist event or placement.</span>
      </label>

      <div className="submission-form-actions">
        <button className="primary-button" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending for review…' : 'Submit for review'} <span aria-hidden="true">↗</span>
        </button>
        <p>By submitting, you confirm that this is an official public opportunity and that MaplePath may contact you if clarification is needed.</p>
      </div>
    </form>
  );
}
