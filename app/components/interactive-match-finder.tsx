'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  opportunities,
  supportedProvinces,
  supportedStudyFocuses,
  type Opportunity,
  type StudyFocus,
} from '../data/opportunities';

interface InteractiveMatchFinderProps {
  catalog?: Opportunity[];
}

export function InteractiveMatchFinder({ catalog = opportunities }: InteractiveMatchFinderProps) {
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedFocus, setSelectedFocus] = useState<StudyFocus | 'all'>('all');

  const matches = useMemo(() => {
    return catalog.filter((opp) => {
      // Grade filter
      if (selectedGrade !== 'all') {
        if (!opp.grades.includes(selectedGrade)) return false;
      }

      // Province filter (matches specific province OR national/online/multiple)
      if (selectedProvince !== 'all') {
        if (
          opp.province !== selectedProvince &&
          opp.province !== 'National' &&
          opp.province !== 'Multiple provinces' &&
          opp.locationMode !== 'Online'
        ) {
          return false;
        }
      }

      // Focus filter (matches specific focus OR 'Any field')
      if (selectedFocus !== 'all') {
        if (
          !opp.studyFocus.includes(selectedFocus) &&
          !opp.studyFocus.includes('Any field')
        ) {
          return false;
        }
      }

      return true;
    });
  }, [catalog, selectedGrade, selectedProvince, selectedFocus]);

  // Breakdown metrics for matched items
  const breakdown = useMemo(() => {
    const scholarships = matches.filter((o) => o.type === 'Scholarship').length;
    const competitions = matches.filter((o) => o.type === 'Competition').length;
    const internships = matches.filter((o) => o.type === 'Internship').length;
    const programs = matches.filter((o) => o.type === 'Program' || o.type === 'Youth role').length;
    return { scholarships, competitions, internships, programs };
  }, [matches]);

  const isFiltered = selectedGrade !== 'all' || selectedProvince !== 'all' || selectedFocus !== 'all';

  const resetFilters = () => {
    setSelectedGrade('all');
    setSelectedProvince('all');
    setSelectedFocus('all');
  };

  // Construct target URL
  const targetHref = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedGrade !== 'all') params.set('grade', selectedGrade.toString());
    if (selectedProvince !== 'all') params.set('province', selectedProvince);
    if (selectedFocus !== 'all') params.set('focus', selectedFocus);
    const queryString = params.toString();
    return queryString ? `/opportunities?${queryString}` : '/opportunities';
  }, [selectedGrade, selectedProvince, selectedFocus]);

  // Check active preset
  const isPresetActive = (grade: number | 'all', prov: string, focus: StudyFocus | 'all') =>
    selectedGrade === grade && selectedProvince === prov && selectedFocus === focus;

  return (
    <div className="match-finder-container">
      {/* Search Console Main Frame */}
      <div className="match-finder-card">
        
        {/* Top Control Grid: 3 Selectors + Action Button */}
        <div className="match-finder-grid">
          
          {/* 1. Grade Selector */}
          <div className="match-finder-col-field">
            <div className="match-finder-control">
              <label htmlFor="finder-grade-select" className="match-finder-label">
                <span className="match-finder-icon-wrap">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </span>
                Student Grade
              </label>
              <div className="match-finder-select-box">
                <select
                  id="finder-grade-select"
                  value={selectedGrade}
                  onChange={(e) =>
                    setSelectedGrade(e.target.value === 'all' ? 'all' : Number(e.target.value))
                  }
                  className="match-finder-select"
                  aria-label="Select student grade"
                >
                  <option value="all">All Grades (9–12)</option>
                  <option value="9">Grade 9 (Freshman)</option>
                  <option value="10">Grade 10 (Sophomore)</option>
                  <option value="11">Grade 11 (Junior)</option>
                  <option value="12">Grade 12 (Graduating)</option>
                </select>
                <div className="match-finder-arrow">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Province Selector */}
          <div className="match-finder-col-field">
            <div className="match-finder-control">
              <label htmlFor="finder-province-select" className="match-finder-label">
                <span className="match-finder-icon-wrap maple">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                Province / Territory
              </label>
              <div className="match-finder-select-box">
                <select
                  id="finder-province-select"
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="match-finder-select"
                  aria-label="Select province or territory"
                >
                  <option value="all">All Canada / Remote</option>
                  {supportedProvinces.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
                <div className="match-finder-arrow">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Study Focus */}
          <div className="match-finder-col-field">
            <div className="match-finder-control">
              <label htmlFor="finder-focus-select" className="match-finder-label">
                <span className="match-finder-icon-wrap forest">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
                Study Interest
              </label>
              <div className="match-finder-select-box">
                <select
                  id="finder-focus-select"
                  value={selectedFocus}
                  onChange={(e) => setSelectedFocus(e.target.value as StudyFocus | 'all')}
                  className="match-finder-select"
                  aria-label="Select study focus"
                >
                  <option value="all">All Fields & Subjects</option>
                  {supportedStudyFocuses.map((focus) => (
                    <option key={focus} value={focus}>
                      {focus}
                    </option>
                  ))}
                </select>
                <div className="match-finder-arrow">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Action Button */}
          <div className="match-finder-col-action">
            <Link
              href={targetHref}
              className="match-finder-btn"
            >
              <span>Explore {matches.length} Matches</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

        </div>

        {/* Bottom Sub-Bar: Live Counter & Popular Presets */}
        <div className="match-finder-subbar">
          
          {/* Left: Dynamic Match Breakdown */}
          <div className="match-finder-breakdown">
            <span className="match-finder-status">
              <span className="match-finder-pulse-dot" />
              <span>{matches.length} Verified Listings Match</span>
            </span>

            <span className="hidden sm:inline text-[var(--border-strong)]">·</span>

            <span className="hidden md:inline text-[var(--ink-secondary)]">
              {breakdown.scholarships} scholarships, {breakdown.competitions} contests, {breakdown.internships + breakdown.programs} internships & roles
            </span>

            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="match-finder-reset-btn"
                title="Reset all filters"
              >
                ✕ Reset
              </button>
            )}
          </div>

          {/* Right: Popular Preset Shortcuts */}
          <div className="match-finder-shortcuts">
            <span className="match-finder-shortcuts-label">
              Shortcuts:
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedGrade('all');
                setSelectedProvince('Ontario');
                setSelectedFocus('Computer science');
              }}
              className={`match-finder-chip ${
                isPresetActive('all', 'Ontario', 'Computer science') ? 'active' : ''
              }`}
            >
              💻 Ontario CS
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedGrade(12);
                setSelectedProvince('all');
                setSelectedFocus('all');
              }}
              className={`match-finder-chip ${
                isPresetActive(12, 'all', 'all') ? 'active' : ''
              }`}
            >
              🎓 Grade 12
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedGrade(11);
                setSelectedProvince('all');
                setSelectedFocus('Biology & health');
              }}
              className={`match-finder-chip ${
                isPresetActive(11, 'all', 'Biology & health') ? 'active' : ''
              }`}
            >
              🔬 Health & STEM
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedGrade('all');
                setSelectedProvince('British Columbia');
                setSelectedFocus('all');
              }}
              className={`match-finder-chip ${
                isPresetActive('all', 'British Columbia', 'all') ? 'active' : ''
              }`}
            >
              🌲 BC
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
