'use client';

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
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

export default function OpportunityDirectory({
  initialSavedIds = [],
  isAuthenticated = false,
}: {
  initialSavedIds?: string[];
  isAuthenticated?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<OpportunityType[]>([]);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
  const [selectedFocuses, setSelectedFocuses] = useState<StudyFocus[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<LocationMode[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'deadline' | 'recent'>('recommended');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Lock background scroll when mobile filter drawer is open
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFiltersOpen]);

  // Handle Escape key to close mobile filter sheet
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileFiltersOpen) {
        setMobileFiltersOpen(false);
      }
    };
    if (mobileFiltersOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileFiltersOpen]);

  const cities = useMemo(
    () => Array.from(new Set(opportunities.map((opportunity) => opportunity.city))).sort(),
    [],
  );

  const filteredOpportunities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matches = opportunities.filter((opportunity) => {
      const searchable = [
        opportunity.title,
        opportunity.provider,
        opportunity.summary,
        opportunity.eligibility,
        ...opportunity.studyFocus,
      ]
        .join(' ')
        .toLowerCase();
      const searchMatches = !normalizedQuery || searchable.includes(normalizedQuery);
      const typeMatches = !selectedTypes.length || selectedTypes.includes(opportunity.type);
      const provinceMatches =
        !selectedProvinces.length ||
        selectedProvinces.includes(opportunity.province) ||
        (opportunity.province === 'National' && !selectedProvinces.includes('National')) ||
        (opportunity.province === 'Multiple provinces' && !selectedProvinces.includes('National'));
      const gradeMatches =
        !selectedGrades.length || selectedGrades.some((grade) => opportunity.grades.includes(grade));
      const focusMatches =
        !selectedFocuses.length ||
        selectedFocuses.some((focus) => opportunity.studyFocus.includes(focus));
      const locationMatches =
        !selectedLocations.length || selectedLocations.includes(opportunity.locationMode);
      const cityMatches =
        !selectedCity ||
        opportunity.city === selectedCity ||
        opportunity.locationMode === 'Online' ||
        opportunity.province === 'National';

      return (
        searchMatches &&
        typeMatches &&
        provinceMatches &&
        gradeMatches &&
        focusMatches &&
        locationMatches &&
        cityMatches
      );
    });

    return [...matches].sort((a, b) => {
      if (sortBy === 'recent') return b.lastVerified.localeCompare(a.lastVerified);
      if (sortBy === 'deadline')
        return (a.deadline.date ?? '9999-12-31').localeCompare(b.deadline.date ?? '9999-12-31');
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [
    query,
    selectedTypes,
    selectedProvinces,
    selectedGrades,
    selectedFocuses,
    selectedLocations,
    selectedCity,
    sortBy,
  ]);

  const activeFiltersCount =
    (query ? 1 : 0) +
    selectedTypes.length +
    selectedProvinces.length +
    selectedGrades.length +
    selectedFocuses.length +
    selectedLocations.length +
    (selectedCity ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0;

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
    totalCount: filteredOpportunities.length,
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
    totalCount?: number;
  };

  return (
    <main className="directory-page-wrapper">
      {/* Page Header */}
      <section className="page-header-banner">
        <div className="page-header-inner">
          <div>
            <Eyebrow>Opportunity directory</Eyebrow>
            <h1>
              Explore opportunities for <em>Canadian students</em>
            </h1>
            <p style={{ marginTop: '10px', color: 'var(--ink-soft)', fontSize: '15px' }}>
              Filter by grade, study focus, province, and opportunity type to find programs verified for high school students.
            </p>
          </div>
          <div className="page-header-aside">
            <span className="page-header-count">
              {opportunities.length}
              <small>+</small>
            </span>
            <span>Curated listings</span>
            <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
              Updated {displayDate(catalogUpdatedAt)}
            </span>
          </div>
        </div>
      </section>

      {/* Directory Content Area */}
      <section className="directory-body-wrapper">
        <div className="directory-layout-grid">
          {/* Desktop Filter Sidebar */}
          <aside className="desktop-filters-sidebar">
            <FilterPanel {...filterProps} />
          </aside>

          {/* Search & Results Main Column */}
          <div className="directory-main-results">
            {/* Search Input Bar + Mobile Trigger */}
            <div className="search-filter-bar">
              <label className="search-input-box">
                <span className="search-icon-decor" aria-hidden="true">
                  ⌕
                </span>
                <span className="sr-only">Search opportunities</span>
                <input
                  className="search-input-field"
                  type="search"
                  placeholder="Search by name, organization, or keywords..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => setQuery('')}
                    aria-label="Clear search text"
                  >
                    ×
                  </button>
                )}
              </label>

              <button
                className="mobile-filter-trigger-btn"
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                aria-label="Open filter options"
              >
                <span aria-hidden="true">☷</span>
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="filter-badge-counter">{activeFiltersCount}</span>
                )}
              </button>
            </div>

            {/* Active Filters Pill Strip */}
            {hasActiveFilters && (
              <div className="active-filters-strip" aria-label="Active filters">
                {query && (
                  <span className="active-filter-tag">
                    Query: &ldquo;{query}&rdquo;
                    <button type="button" onClick={() => setQuery('')} aria-label="Remove search query">
                      ×
                    </button>
                  </span>
                )}
                {selectedTypes.map((type) => (
                  <span className="active-filter-tag" key={type}>
                    {type}
                    <button
                      type="button"
                      onClick={() => setSelectedTypes((prev) => prev.filter((t) => t !== type))}
                      aria-label={`Remove ${type} filter`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedGrades.map((grade) => (
                  <span className="active-filter-tag" key={grade}>
                    Grade {grade}
                    <button
                      type="button"
                      onClick={() => setSelectedGrades((prev) => prev.filter((g) => g !== grade))}
                      aria-label={`Remove Grade ${grade} filter`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedFocuses.map((focus) => (
                  <span className="active-filter-tag" key={focus}>
                    {focus}
                    <button
                      type="button"
                      onClick={() => setSelectedFocuses((prev) => prev.filter((f) => f !== focus))}
                      aria-label={`Remove ${focus} filter`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedLocations.map((loc) => (
                  <span className="active-filter-tag" key={loc}>
                    {loc}
                    <button
                      type="button"
                      onClick={() => setSelectedLocations((prev) => prev.filter((l) => l !== loc))}
                      aria-label={`Remove ${loc} filter`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedProvinces.map((prov) => (
                  <span className="active-filter-tag" key={prov}>
                    {prov}
                    <button
                      type="button"
                      onClick={() => setSelectedProvinces((prev) => prev.filter((p) => p !== prov))}
                      aria-label={`Remove ${prov} filter`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedCity && (
                  <span className="active-filter-tag">
                    City: {selectedCity}
                    <button type="button" onClick={() => setSelectedCity('')} aria-label="Remove city filter">
                      ×
                    </button>
                  </span>
                )}
                <button type="button" className="clear-all-link-btn" onClick={resetFilters}>
                  Clear all
                </button>
              </div>
            )}

            {/* Results Toolbar: Count + Sort + City */}
            <div className="directory-toolbar">
              <p className="results-count-text" aria-live="polite">
                <strong>{filteredOpportunities.length}</strong>{' '}
                {filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities'} found
              </p>

              <div className="toolbar-selectors">
                <label className="select-control-wrap">
                  <span>City:</span>
                  <select
                    className="custom-select"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    aria-label="Filter by City"
                  >
                    <option value="">All cities</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="select-control-wrap">
                  <span>Sort:</span>
                  <select
                    className="custom-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    aria-label="Sort opportunities"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="deadline">Deadline soonest</option>
                    <option value="recent">Recently checked</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Cards Grid or Empty State */}
            {filteredOpportunities.length > 0 ? (
              <div className="opportunities-grid">
                {filteredOpportunities.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    initialSaved={initialSavedIds.includes(opportunity.id)}
                    isAuthenticated={isAuthenticated}
                    returnTo="/opportunities"
                  />
                ))}
              </div>
            ) : (
              <div className="empty-directory-box">
                <span style={{ fontSize: '28px', color: 'var(--maple)', marginBottom: '12px' }}>
                  ⌕
                </span>
                <h3>No matching opportunities found</h3>
                <p>
                  Try broadening your search term or clearing some of your active filters to see more listings.
                </p>
                <button
                  type="button"
                  className="primary-button"
                  onClick={resetFilters}
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filter Bottom Sheet Modal */}
      {mobileFiltersOpen && (
        <div
          className="mobile-filter-modal-backdrop"
          onClick={() => setMobileFiltersOpen(false)}
          role="presentation"
        >
          <div
            className="mobile-filter-sheet-content"
            role="dialog"
            aria-modal="true"
            aria-label="Filter opportunities"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-filter-sheet-body">
              <FilterPanel
                {...filterProps}
                mobile
                onClose={() => setMobileFiltersOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
