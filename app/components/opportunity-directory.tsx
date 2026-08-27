'use client';

import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import {
  catalogUpdatedAt,
  opportunities,
  type LocationMode,
  type OpportunityType,
  type StudyFocus,
} from '../data/opportunities';
import { FilterPanel } from './filters';
import { OpportunityCard } from './opportunity-card';
import { displayDate, Eyebrow } from './site-chrome';

export default function OpportunityDirectory() {
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
      const searchable = [
        opportunity.title,
        opportunity.provider,
        opportunity.summary,
        opportunity.eligibility,
        ...opportunity.studyFocus,
      ].join(' ').toLowerCase();
      const searchMatches = !normalizedQuery || searchable.includes(normalizedQuery);
      const typeMatches = !selectedTypes.length || selectedTypes.includes(opportunity.type);
      const provinceMatches = !selectedProvinces.length
        || selectedProvinces.includes(opportunity.province)
        || (opportunity.province === 'National' && !selectedProvinces.includes('National'))
        || (opportunity.province === 'Multiple provinces' && !selectedProvinces.includes('National'));
      const gradeMatches = !selectedGrades.length || selectedGrades.some((grade) => opportunity.grades.includes(grade));
      const focusMatches = !selectedFocuses.length || selectedFocuses.some((focus) => opportunity.studyFocus.includes(focus));
      const locationMatches = !selectedLocations.length || selectedLocations.includes(opportunity.locationMode);
      const cityMatches = !selectedCity
        || opportunity.city === selectedCity
        || opportunity.locationMode === 'Online'
        || opportunity.province === 'National';
      return searchMatches && typeMatches && provinceMatches && gradeMatches && focusMatches && locationMatches && cityMatches;
    });

    return [...matches].sort((a, b) => {
      if (sortBy === 'recent') return b.lastVerified.localeCompare(a.lastVerified);
      if (sortBy === 'deadline') return (a.deadline.date ?? '9999-12-31').localeCompare(b.deadline.date ?? '9999-12-31');
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [query, selectedTypes, selectedProvinces, selectedGrades, selectedFocuses, selectedLocations, selectedCity, sortBy]);

  const hasActiveFilters = Boolean(query)
    || selectedTypes.length > 0
    || selectedProvinces.length > 0
    || selectedGrades.length > 0
    || selectedFocuses.length > 0
    || selectedLocations.length > 0
    || Boolean(selectedCity);

  const resetFilters = () => {
    setQuery('');
    setSelectedTypes([]);
    setSelectedProvinces([]);
    setSelectedGrades([]);
    setSelectedFocuses([]);
    setSelectedLocations([]);
    setSelectedCity('');
  };

  const filterProps = {
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
    onReset: resetFilters,
  } satisfies {
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
  };

  return (
    <main className="directory-page">
      <section className="page-intro">
        <div className="page-intro-copy">
          <Eyebrow>Explore the catalog</Eyebrow>
          <h1>The right opportunity<br /><em>is out there.</em></h1>
          <p>Search a carefully reviewed starting point for Canadian high-school students. Mix filters together to narrow the list to what fits your grade, place, and interests.</p>
        </div>
        <div className="page-intro-aside">
          <span className="page-intro-number">{opportunities.length}<small>+</small></span>
          <span className="page-intro-label">curated listings</span>
          <span className="page-intro-note">Last reviewed {displayDate(catalogUpdatedAt)}</span>
        </div>
      </section>

      <section className="directory-section directory-section-route" id="directory">
        <div className="section-heading">
          <div>
            <Eyebrow>Find your fit</Eyebrow>
            <h2>Start broad.<br /><em>Then get specific.</em></h2>
          </div>
          <p className="section-intro">Multiple choices within a filter work like “or.” Different filter groups work together like “and.”</p>
        </div>

        <div className="directory-layout">
          <aside className="desktop-filter-column">
            <FilterPanel {...filterProps} />
          </aside>
          <div className="results-column">
            <div className="search-row">
              <label className="search-box">
                <span className="search-icon" aria-hidden="true">⌕</span>
                <span className="sr-only">Search opportunities</span>
                <input
                  type="search"
                  placeholder="Search by name, organization, or interest..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query && <button type="button" className="clear-search" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
              </label>
              <button className="mobile-filter-button" type="button" onClick={() => setMobileFiltersOpen(true)}>
                <span aria-hidden="true">☷</span> Filters
                {hasActiveFilters && <span className="filter-count">{selectedTypes.length + selectedProvinces.length + selectedGrades.length + selectedFocuses.length + selectedLocations.length + (selectedCity ? 1 : 0)}</span>}
              </button>
            </div>

            <div className="results-toolbar">
              <p aria-live="polite"><strong>{filteredOpportunities.length}</strong> {filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities'} <span>found</span></p>
              <label className="sort-control">
                <span>Sort by</span>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}>
                  <option value="recommended">Recommended</option>
                  <option value="deadline">Deadline soonest</option>
                  <option value="recent">Recently checked</option>
                </select>
              </label>
            </div>

            <div className="secondary-filters">
              <label className="city-select">
                <span>City</span>
                <select value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}>
                  <option value="">All cities</option>
                  {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </label>
              {hasActiveFilters && <button type="button" className="reset-inline" onClick={resetFilters}>Clear all filters <span aria-hidden="true">×</span></button>}
            </div>

            {filteredOpportunities.length > 0 ? (
              <div className="cards-grid">
                {filteredOpportunities.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-mark" aria-hidden="true">⌕</span>
                <h3>Nothing here yet.</h3>
                <p>Try a wider search, or clear a filter to see more of the directory.</p>
                <button type="button" className="primary-button small-button" onClick={resetFilters}>Reset filters</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {mobileFiltersOpen && (
        <div className="mobile-filter-backdrop" role="presentation" onClick={() => setMobileFiltersOpen(false)}>
          <div className="mobile-filter-sheet" role="dialog" aria-modal="true" aria-label="Filter opportunities" onClick={(event) => event.stopPropagation()}>
            <FilterPanel {...filterProps} mobile onClose={() => setMobileFiltersOpen(false)} />
          </div>
        </div>
      )}
    </main>
  );
}
