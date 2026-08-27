'use client';

import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import {
  catalogUpdatedAt,
  opportunities,
  type Opportunity,
  type OpportunityType,
  type LocationMode,
  type StudyFocus,
} from './data/opportunities';

const typeOptions: OpportunityType[] = ['Internship', 'Competition', 'Scholarship'];
const gradeOptions = [9, 10, 11, 12];
const provinceOptions = [
  'National',
  'Multiple provinces',
  'Online / worldwide',
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Northwest Territories',
  'Nunavut',
  'Yukon',
];
const accessOptions: LocationMode[] = ['Canada', 'Online', 'Worldwide'];
const focusOptions: StudyFocus[] = [
  'Biology & health',
  'Business & finance',
  'Computer science',
  'Engineering',
  'Environment',
  'Mathematics',
  'Arts & design',
  'Social impact',
  'Any field',
];

const typeMeta: Record<OpportunityType, { label: string; accent: string; icon: string }> = {
  Internship: { label: 'Internship', accent: 'coral', icon: '↗' },
  Competition: { label: 'Competition', accent: 'blue', icon: '✦' },
  Scholarship: { label: 'Scholarship', accent: 'gold', icon: '◎' },
};

const displayDate = (value: string) =>
  new Intl.DateTimeFormat('en-CA', { month: 'long', day: 'numeric', year: 'numeric' }).format(
    new Date(`${value}T12:00:00`),
  );

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
  optionLabel,
}: {
  title: string;
  options: (string | number)[];
  selected: (string | number)[];
  onToggle: (value: string | number) => void;
  optionLabel?: (value: string | number) => string;
}) {
  return (
    <fieldset className="filter-group">
      <legend>{title}</legend>
      <div className="filter-options">
        {options.map((option) => {
          const key = String(option);
          const isSelected = selected.includes(option);
          return (
            <label className={`filter-chip ${isSelected ? 'is-selected' : ''}`} key={key}>
              <input type="checkbox" checked={isSelected} onChange={() => onToggle(option)} />
              <span>{optionLabel ? optionLabel(option) : key}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const meta = typeMeta[opportunity.type];
  return (
    <article className={`opportunity-card accent-${meta.accent}`}>
      <div className="card-topline">
        <span className="type-badge">
          <span aria-hidden="true">{meta.icon}</span>
          {meta.label}
        </span>
        {opportunity.featured && <span className="featured-label">Worth a look</span>}
      </div>
      <h3>{opportunity.title}</h3>
      <p className="card-provider">{opportunity.provider}</p>
      <div className="card-details">
        <span><span aria-hidden="true">⌖</span> {opportunity.locationLabel}</span>
        <span><span aria-hidden="true">#</span> Grades {opportunity.grades.join(' · ')}</span>
        <span><span aria-hidden="true">◷</span> {opportunity.deadline.label}</span>
      </div>
      <p className="card-summary">{opportunity.summary}</p>
      <p className="eligibility-note"><span aria-hidden="true">✓</span> {opportunity.eligibility}</p>
      <div className="card-bottom">
        <div className="tag-row" aria-label="Study focus">
          {opportunity.studyFocus.slice(0, 3).map((focus) => <span className="topic-tag" key={focus}>{focus}</span>)}
        </div>
        <a
          className="apply-link"
          href={opportunity.applyUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open official application page for ${opportunity.title}`}
        >
          Official page <span aria-hidden="true">↗</span>
        </a>
      </div>
      <p className="verified-line">Checked {displayDate(opportunity.lastVerified)}</p>
    </article>
  );
}

function FilterPanel({
  selectedTypes,
  setSelectedTypes,
  selectedProvinces,
  setSelectedProvinces,
  selectedGrades,
  setSelectedGrades,
  selectedFocuses,
  setSelectedFocuses,
  selectedLocations,
  setSelectedLocations,
  onReset,
  onClose,
  mobile = false,
}: {
  selectedTypes: OpportunityType[];
  setSelectedTypes: Dispatch<SetStateAction<OpportunityType[]>>;
  selectedProvinces: string[];
  setSelectedProvinces: Dispatch<SetStateAction<string[]>>;
  selectedGrades: number[];
  setSelectedGrades: Dispatch<SetStateAction<number[]>>;
  selectedFocuses: StudyFocus[];
  setSelectedFocuses: Dispatch<SetStateAction<StudyFocus[]>>;
  selectedLocations: LocationMode[];
  setSelectedLocations: Dispatch<SetStateAction<LocationMode[]>>;
  onReset: () => void;
  onClose?: () => void;
  mobile?: boolean;
}) {
  const toggle = <T,>(value: T, setter: Dispatch<SetStateAction<T[]>>) => {
    setter((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
  };

  return (
    <div className={`filter-card ${mobile ? 'filter-card-mobile' : ''}`}>
      <div className="filter-card-header">
        <div><span className="eyebrow-small">Refine</span><h2>Find your fit</h2></div>
        <div className="filter-card-actions">
          <button className="text-button" type="button" onClick={onReset}>Reset</button>
          {onClose && <button className="close-button" type="button" onClick={onClose} aria-label="Close filters">×</button>}
        </div>
      </div>
      <FilterGroup title="Opportunity type" options={typeOptions} selected={selectedTypes} onToggle={(value) => toggle(value as OpportunityType, setSelectedTypes)} />
      <FilterGroup title="Grade" options={gradeOptions} selected={selectedGrades} onToggle={(value) => toggle(value as number, setSelectedGrades)} optionLabel={(value) => `Grade ${value}`} />
      <FilterGroup title="Study focus" options={focusOptions} selected={selectedFocuses} onToggle={(value) => toggle(value as StudyFocus, setSelectedFocuses)} />
      <FilterGroup title="Access" options={accessOptions} selected={selectedLocations} onToggle={(value) => toggle(value as LocationMode, setSelectedLocations)} optionLabel={(value) => value === 'Canada' ? 'Canada-based' : value === 'Online' ? 'Online' : 'Worldwide · Canada eligible'} />
      <FilterGroup title="Province or territory" options={provinceOptions} selected={selectedProvinces} onToggle={(value) => toggle(value as string, setSelectedProvinces)} />
      {mobile && <button className="mobile-filter-done" type="button" onClick={onClose}>Show matching opportunities <span aria-hidden="true">↗</span></button>}
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<OpportunityType[]>([]);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
  const [selectedFocuses, setSelectedFocuses] = useState<StudyFocus[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<LocationMode[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'deadline' | 'recent'>('recommended');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const cities = useMemo(() => Array.from(new Set(opportunities.map((opportunity) => opportunity.city))).sort(), []);

  const filteredOpportunities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matches = opportunities.filter((opportunity) => {
      const searchable = [opportunity.title, opportunity.provider, opportunity.summary, opportunity.eligibility, ...opportunity.studyFocus].join(' ').toLowerCase();
      const searchMatches = !normalizedQuery || searchable.includes(normalizedQuery);
      const typeMatches = !selectedTypes.length || selectedTypes.includes(opportunity.type);
      const provinceMatches = !selectedProvinces.length || selectedProvinces.includes(opportunity.province) || (opportunity.province === 'National' && !selectedProvinces.includes('National')) || (opportunity.province === 'Multiple provinces' && !selectedProvinces.includes('National'));
      const gradeMatches = !selectedGrades.length || selectedGrades.some((grade) => opportunity.grades.includes(grade));
      const focusMatches = !selectedFocuses.length || selectedFocuses.some((focus) => opportunity.studyFocus.includes(focus));
      const locationMatches = !selectedLocations.length || selectedLocations.includes(opportunity.locationMode);
      const cityMatches = !selectedCity || opportunity.city === selectedCity || opportunity.locationMode === 'Online' || opportunity.province === 'National';
      return searchMatches && typeMatches && provinceMatches && gradeMatches && focusMatches && locationMatches && cityMatches;
    });

    return [...matches].sort((a, b) => {
      if (sortBy === 'recent') return b.lastVerified.localeCompare(a.lastVerified);
      if (sortBy === 'deadline') return (a.deadline.date ?? '9999-12-31').localeCompare(b.deadline.date ?? '9999-12-31');
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [query, selectedTypes, selectedProvinces, selectedGrades, selectedFocuses, selectedLocations, selectedCity, sortBy]);

  const hasActiveFilters = Boolean(query) || selectedTypes.length > 0 || selectedProvinces.length > 0 || selectedGrades.length > 0 || selectedFocuses.length > 0 || selectedLocations.length > 0 || Boolean(selectedCity);

  const resetFilters = () => {
    setQuery('');
    setSelectedTypes([]);
    setSelectedProvinces([]);
    setSelectedGrades([]);
    setSelectedFocuses([]);
    setSelectedLocations([]);
    setSelectedCity('');
  };

  const scrollToDirectory = () => document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="MaplePath home"><span className="brand-mark" aria-hidden="true">✦</span><span>MaplePath</span></a>
        <nav className="desktop-nav" aria-label="Primary navigation"><a href="#directory">Explore</a><a href="#how-it-works">How it works</a></nav>
        <button className="header-button" type="button" onClick={scrollToDirectory}>Browse opportunities <span aria-hidden="true">↘</span></button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> A clearer way forward</p>
          <h1>Find the next <em>open door.</em></h1>
          <p className="hero-description">MaplePath brings Canada’s scholarships, internships, and competitions into one calm, useful place — so you can spend less time searching and more time applying.</p>
          <div className="hero-actions"><button className="primary-button" type="button" onClick={scrollToDirectory}>Explore the directory <span aria-hidden="true">↘</span></button><span className="hero-note"><span aria-hidden="true">✦</span> Curated for Grades 9–12</span></div>
        </div>
        <div className="hero-visual" aria-label="MaplePath catalog snapshot">
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
          <div className="snapshot-card"><div className="snapshot-label">The weekly shortlist</div><div className="snapshot-number">{opportunities.length}<span>+</span></div><div className="snapshot-title">real possibilities,<br />one starting point.</div><div className="snapshot-footer"><span className="status-dot" /> Canada-first · online-friendly</div></div>
          <span className="float-label float-label-top">Scholarships <span>◎</span></span><span className="float-label float-label-bottom">Build something <span>✦</span></span>
        </div>
      </section>

      <section className="trust-strip" aria-label="MaplePath principles">
        <div><span className="trust-icon">01</span><span><strong>Official links</strong> Every listing points to its source.</span></div>
        <div><span className="trust-icon">02</span><span><strong>Useful filters</strong> Search by where you are and what you love.</span></div>
        <div><span className="trust-icon">03</span><span><strong>Fresh thinking</strong> The catalog is reviewed every week.</span></div>
      </section>

      <section className="directory-section" id="directory">
        <div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-dot" /> The directory</p><h2>Good things start<br /><em>with a search.</em></h2></div><p className="section-intro">A growing shortlist of opportunities worth your time. Start broad, then narrow it down until something feels like yours.</p></div>
        <div className="directory-layout">
          <aside className="desktop-filter-column"><FilterPanel selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} selectedProvinces={selectedProvinces} setSelectedProvinces={setSelectedProvinces} selectedGrades={selectedGrades} setSelectedGrades={setSelectedGrades} selectedFocuses={selectedFocuses} setSelectedFocuses={setSelectedFocuses} selectedLocations={selectedLocations} setSelectedLocations={setSelectedLocations} onReset={resetFilters} /></aside>
          <div className="results-column">
            <div className="search-row"><label className="search-box"><span className="search-icon" aria-hidden="true">⌕</span><span className="sr-only">Search opportunities</span><input type="search" placeholder="Search by name, organization, or interest..." value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button type="button" className="clear-search" onClick={() => setQuery('')} aria-label="Clear search">×</button>}</label><button className="mobile-filter-button" type="button" onClick={() => setMobileFiltersOpen(true)}><span aria-hidden="true">☷</span> Filters{hasActiveFilters && <span className="filter-count">{selectedTypes.length + selectedProvinces.length + selectedGrades.length + selectedFocuses.length + selectedLocations.length + (selectedCity ? 1 : 0)}</span>}</button></div>
            <div className="results-toolbar"><p aria-live="polite"><strong>{filteredOpportunities.length}</strong> {filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities'} <span>found</span></p><label className="sort-control"><span>Sort by</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}><option value="recommended">Recommended</option><option value="deadline">Deadline soonest</option><option value="recent">Recently checked</option></select></label></div>
            <div className="secondary-filters"><label className="city-select"><span>City</span><select value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}><option value="">All cities</option>{cities.map((city) => <option key={city} value={city}>{city}</option>)}</select></label>{hasActiveFilters && <button type="button" className="reset-inline" onClick={resetFilters}>Clear all filters <span aria-hidden="true">×</span></button>}</div>
            {filteredOpportunities.length > 0 ? <div className="cards-grid">{filteredOpportunities.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}</div> : <div className="empty-state"><span className="empty-mark" aria-hidden="true">⌕</span><h3>Nothing here yet.</h3><p>Try a wider search, or clear a filter to see more of the directory.</p><button type="button" className="primary-button small-button" onClick={resetFilters}>Reset filters</button></div>}
          </div>
        </div>
      </section>

      <section className="how-section" id="how-it-works"><div className="how-copy"><p className="eyebrow"><span className="eyebrow-dot" /> Make a move</p><h2>Less scrolling.<br /><em>More starting.</em></h2><p>Every opportunity has a direct path to the organization running it. MaplePath helps you find the right door; you decide when to walk through it.</p></div><div className="how-steps"><div className="how-step"><span>01</span><div><h3>Choose a direction</h3><p>Filter by grade, province, city, and the subjects that pull you in.</p></div></div><div className="how-step"><span>02</span><div><h3>Read the fit</h3><p>Scan the deadline, eligibility notes, and what the experience actually involves.</p></div></div><div className="how-step"><span>03</span><div><h3>Go to the source</h3><p>Use the official link to confirm the details and apply with confidence.</p></div></div></div></section>

      <footer className="site-footer"><div className="footer-brand"><span className="brand-mark" aria-hidden="true">✦</span><span>MaplePath</span></div><p>A student-built starting point for bigger possibilities.</p><div className="footer-meta"><span>Catalog last reviewed {displayDate(catalogUpdatedAt)}</span><a href="#top">Back to top ↑</a></div></footer>

      {mobileFiltersOpen && <div className="mobile-filter-backdrop" role="presentation" onClick={() => setMobileFiltersOpen(false)}><div className="mobile-filter-sheet" role="dialog" aria-modal="true" aria-label="Filter opportunities" onClick={(event) => event.stopPropagation()}><FilterPanel mobile selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} selectedProvinces={selectedProvinces} setSelectedProvinces={setSelectedProvinces} selectedGrades={selectedGrades} setSelectedGrades={setSelectedGrades} selectedFocuses={selectedFocuses} setSelectedFocuses={setSelectedFocuses} selectedLocations={selectedLocations} setSelectedLocations={setSelectedLocations} onReset={resetFilters} onClose={() => setMobileFiltersOpen(false)} /></div></div>}
    </main>
  );
}
