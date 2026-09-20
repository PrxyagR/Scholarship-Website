'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Opportunity } from '../data/opportunities';
import {
  buildRoadmapSteps,
  roadmapFormatOptions,
  roadmapGoalOptions,
  roadmapTimeOptions,
  type RoadmapAnswers,
  type RoadmapFormat,
  type RoadmapGoal,
  type RoadmapTime,
} from '@/lib/roadmap';
import {
  studentFocusOptions,
  type StudentProfile,
} from '@/lib/student-tools';
import { Eyebrow } from './site-chrome';
import { MapleWatermark, MapleTreeEmblem, TreeGrowthStage } from './brand-motif';

export default function RoadmapBuilder({
  initialAnswers,
  profile,
  savedCount,
  recommendations,
}: {
  initialAnswers: RoadmapAnswers;
  profile: StudentProfile;
  savedCount: number;
  recommendations: Opportunity[];
}) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [steps, setSteps] = useState(() => buildRoadmapSteps(initialAnswers, profile, savedCount, recommendations));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const profileLabel = useMemo(() => {
    const parts = [profile.grade ? `Grade ${profile.grade}` : '', profile.province].filter(Boolean);
    return parts.length ? parts.join(' · ') : 'Profile not completed yet';
  }, [profile]);

  async function saveRoadmap(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/roadmap', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const payload = (await response.json().catch(() => null)) as { redirectTo?: unknown } | null;
      if (response.status === 401 && typeof payload?.redirectTo === 'string') {
        window.location.assign(payload.redirectTo);
        return;
      }
      if (!response.ok) throw new Error('roadmap update failed');
      setSteps(buildRoadmapSteps(answers, profile, savedCount, recommendations));
      setMessage('Saved. Your four-step plan is updated.');
    } catch {
      setMessage('We could not save your answers. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="roadmap-page-wrapper">
      <section className="roadmap-hero relative overflow-hidden">
        <MapleWatermark className="right-0 top-0 w-80 h-full text-[var(--spruce-primary)]" opacity={0.06} />
        <div className="relative z-10">
          <Eyebrow>Private student roadmap</Eyebrow>
          <h1>Turn a broad interest into a next step.</h1>
          <p>
            A short planning tool for choosing one direction, finding a realistic opportunity, and keeping your application moving.
          </p>
        </div>
        <div className="roadmap-profile-chip relative z-10">
          <span>Using your profile</span>
          <strong>{profileLabel}</strong>
          <Link href="/dashboard">Edit profile ↗</Link>
        </div>
      </section>

      <section className="roadmap-content-grid">
        <form className="roadmap-question-card" onSubmit={saveRoadmap}>
          <div className="roadmap-card-heading">
            <div>
              <Eyebrow>Make it yours</Eyebrow>
              <h2>What are you hoping to do next?</h2>
            </div>
            <span className="roadmap-private-label">Private to you</span>
          </div>

          <fieldset className="roadmap-fieldset">
            <legend>Your main goal</legend>
            <div className="roadmap-choice-grid">
              {roadmapGoalOptions.map((option) => (
                <label className={`roadmap-choice${answers.goal === option.value ? ' is-selected' : ''}`} key={option.value}>
                  <input
                    type="radio"
                    name="goal"
                    value={option.value}
                    checked={answers.goal === option.value}
                    onChange={() => setAnswers((current) => ({ ...current, goal: option.value as RoadmapGoal }))}
                  />
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="roadmap-form-row">
            <label className="dashboard-field">
              <span>Preferred format</span>
              <select
                className="dashboard-select"
                value={answers.format}
                onChange={(event) => setAnswers((current) => ({ ...current, format: event.target.value as RoadmapFormat }))}
              >
                {roadmapFormatOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="dashboard-field">
              <span>Time you can give each week</span>
              <select
                className="dashboard-select"
                value={answers.time}
                onChange={(event) => setAnswers((current) => ({ ...current, time: event.target.value as RoadmapTime }))}
              >
                {roadmapTimeOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>

          <fieldset className="roadmap-fieldset">
            <legend>What would you like to explore? <span>(optional)</span></legend>
            <div className="roadmap-focus-grid">
              {studentFocusOptions.map((focus) => {
                const checked = answers.focuses.includes(focus);
                return (
                  <label className={`roadmap-focus-chip${checked ? ' is-selected' : ''}`} key={focus}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setAnswers((current) => ({
                        ...current,
                        focuses: checked
                          ? current.focuses.filter((item) => item !== focus)
                          : [...current.focuses, focus].slice(0, 3),
                      }))}
                    />
                    <span>{focus}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="roadmap-form-actions">
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save my roadmap'} <span aria-hidden="true">↗</span>
            </button>
            <span className="dashboard-save-message" role="status">{message}</span>
          </div>
        </form>

        <aside className="roadmap-why-card">
          <Eyebrow>A useful constraint</Eyebrow>
          <h2>One strong next step beats ten open tabs.</h2>
          <div className="my-3 flex justify-center">
            <MapleTreeEmblem className="w-28 h-28 opacity-90" />
          </div>
          <p>
            MaplePath keeps this plan deliberately small. Use it to choose something you can actually finish, then let your shortlist and tracker do the remembering.
          </p>
          <Link className="secondary-button" href="/opportunities">Browse the catalog ↗</Link>
        </aside>
      </section>

      <section className="roadmap-steps-section" aria-labelledby="roadmap-steps-heading">
        <div className="section-header-row">
          <div>
            <Eyebrow>Your plan</Eyebrow>
            <h2 id="roadmap-steps-heading">A simple path forward</h2>
          </div>
          <p className="section-header-intro">Update your answers any time as your interests become clearer.</p>
        </div>
        <div className="roadmap-steps-grid">
          {steps.map((step) => (
            <article className="roadmap-step-card" key={step.number}>
              <div className="flex items-center gap-2 mb-2">
                <span className="roadmap-step-badge" aria-hidden="true">{step.number}</span>
                <TreeGrowthStage grade={8 + Number(step.number)} className="h-4 w-4" />
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <Link className="text-link" href={step.href}>{step.linkLabel} <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
