'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  catalogUpdatedAt,
  getOpportunityCost,
  getOpportunityFormat,
  getOpportunityStatus,
  getOrganizerCountry,
  opportunities,
  type Opportunity,
  type OpportunityCost,
  type OpportunityFormat,
  type LocationMode,
  type OpportunityStatus,
  type OpportunityType,
  type OrganizerCountry,
  type StudyFocus,
} from '../data/opportunities';
import { FilterPanel } from './filters';
import { OpportunityCard } from './opportunity-card';
import { OpportunityMap } from './opportunity-map';
import { displayDate, Eyebrow } from './site-chrome';
import { MapleWatermark, MapleTreeEmblem, MapleLeafIcon } from './brand-motif';

export default function OpportunityDirectory({
  catalog = opportunities,
  initialSavedIds = [],
  isAuthenticated = false,
  initialTypes = [],
  initialGrades = [],
  initialProvinces = [],
  initialFocuses = [],
}: {
  catalog?: Opportunity[];
  initialSavedIds?: string[];
  isAuthenticated?: boolean;
  initialTypes?: OpportunityType[];
  initialGrades?: number[];
  initialProvinces?: string[];
  initialFocuses?: StudyFocus[];
}) {
  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<OpportunityType[]>(initialTypes);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>(initialProvinces);
  const [selectedGrades, setSelectedGrades] = useState<number[]>(initialGrades);
  const [selectedFocuses, setSelectedFocuses] = useState<StudyFocus[]>(initialFocuses);
  const [selectedLocations, setSelectedLocations] = useState<LocationMode[]>([]);
  const [selectedCosts, setSelectedCosts] = useState<OpportunityCost[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<OpportunityFormat[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<OpportunityStatus[]>([]);
  const [selectedOrganizerCountries, setSelectedOrganizerCountries] = useState<OrganizerCountry[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'deadline' | 'recent'>('recommended');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const mobileFilterTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileFilterSheetRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input with '/' or 'Cmd+K' / 'Ctrl+K'
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
        return;
      }
      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const closeMobileFilters = useCallback(() => {
    setMobileFiltersOpen(false);
    window.requestAnimationFrame(() => mobileFilterTriggerRef.current?.focus());
  }, []);

  // Lock background scroll when mobile filter drawer is open
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
      window.requestAnimationFrame(() => {
        mobileFilterSheetRef.current
          ?.querySelector<HTMLElement>('button, input, select, [tabindex]:not([tabindex="-1"])')
          ?.focus();
      });
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFiltersOpen]);

  // Keep keyboard focus inside the filter sheet and close it with Escape.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileFiltersOpen) {
        closeMobileFilters();
        return;
      }

      if (e.key === 'Tab' && mobileFiltersOpen) {
        const focusable = Array.from(
          mobileFilterSheetRef.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ) ?? [],
        );
        const first = focusable[0];
        const last = focusable.at(-1);

        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    if (mobileFiltersOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeMobileFilters, mobileFiltersOpen]);

  const citySuggestions = useMemo(
    () => Array.from(new Set(catalog.map((opportunity) => opportunity.city))).sort(),
    [catalog],
  );

  const filteredOpportunities = useMemo(() => {
    const queryTerms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const matches = catalog.filter((opportunity) => {
      const searchable = [
        opportunity.title,
        opportunity.provider,
        opportunity.summary,
        opportunity.eligibility,
        opportunity.type,
        opportunity.city,
        opportunity.province,
        opportunity.locationLabel,
        getOpportunityStatus(opportunity),
        getOpportunityCost(opportunity),
        getOpportunityFormat(opportunity),
        getOrganizerCountry(opportunity),
        ...opportunity.studyFocus,
      ]
        .join(' ')
        .toLowerCase();
      const searchMatches = !queryTerms.length || queryTerms.every((term) => searchable.includes(term));
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
      const normalizedCity = selectedCity.trim().toLowerCase();
      const cityMatches =
        !normalizedCity ||
        [opportunity.city, opportunity.locationLabel, opportunity.province]
          .join(' ')
          .toLowerCase()
          .includes(normalizedCity);
      const costMatches =
        !selectedCosts.length || selectedCosts.includes(getOpportunityCost(opportunity));
      const formatMatches =
        !selectedFormats.length || selectedFormats.includes(getOpportunityFormat(opportunity));
      const statusMatches =
        !selectedStatuses.length || selectedStatuses.includes(getOpportunityStatus(opportunity));
      const organizerMatches =
        !selectedOrganizerCountries.length ||
        selectedOrganizerCountries.includes(getOrganizerCountry(opportunity));

      return (
        searchMatches &&
        typeMatches &&
        provinceMatches &&
        gradeMatches &&
        focusMatches &&
        locationMatches &&
        cityMatches &&
        costMatches &&
        formatMatches &&
        statusMatches &&
        organizerMatches
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
    selectedCosts,
    selectedFormats,
    selectedStatuses,
    selectedOrganizerCountries,
    selectedCity,
    sortBy,
    catalog,
  ]);

  const activeFiltersCount =
    (query ? 1 : 0) +
    selectedTypes.length +
    selectedProvinces.length +
    selectedGrades.length +
    selectedFocuses.length +
    selectedLocations.length +
    selectedCosts.length +
    selectedFormats.length +
    selectedStatuses.length +
    selectedOrganizerCountries.length +
    (selectedCity ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0;

  const resetFilters = () => {
    setQuery('');
    setSelectedTypes([]);
    setSelectedProvinces([]);
    setSelectedGrades([]);
    setSelectedFocuses([]);
    setSelectedLocations([]);
    setSelectedCosts([]);
    setSelectedFormats([]);
    setSelectedStatuses([]);
    setSelectedOrganizerCountries([]);
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
    selectedCosts,
    setSelectedCosts,
    selectedFormats,
    setSelectedFormats,
    selectedStatuses,
    setSelectedStatuses,
    selectedOrganizerCountries,
    setSelectedOrganizerCountries,
    onReset: resetFilters,
    hasExternalFilters: Boolean(query || selectedCity),
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
    selectedCosts: OpportunityCost[];
    setSelectedCosts: Dispatch<SetStateAction<OpportunityCost[]>>;
    selectedFormats: OpportunityFormat[];
    setSelectedFormats: Dispatch<SetStateAction<OpportunityFormat[]>>;
    selectedStatuses: OpportunityStatus[];
    setSelectedStatuses: Dispatch<SetStateAction<OpportunityStatus[]>>;
    selectedOrganizerCountries: OrganizerCountry[];
    setSelectedOrganizerCountries: Dispatch<SetStateAction<OrganizerCountry[]>>;
    onReset: () => void;
    hasExternalFilters?: boolean;
    totalCount?: number;
  };

  return (
    <main className="directory-page-wrapper">
      {/* Page Header */}
      <section className="page-header-banner relative overflow-hidden">
        <MapleWatermark className="right-0 top-0 w-96 h-full text-[var(--spruce-primary)]" opacity={0.06} />
        <div className="page-header-inner relative z-10">
          <div>
            <Eyebrow>Opportunity directory</Eyebrow>
            <h1>
              Explore opportunities for <em>Canadian students</em>
            </h1>
            <p style={{ marginTop: '10px', color: 'var(--ink-soft)', fontSize: '15px' }}>
              Filter by grade, study focus, location, format, cost, and availability to find verified options for high school students.
            </p>
          </div>
          <div className="page-header-aside">
            <span className="page-header-count">
              {catalog.length}
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
        <div className="directory-community-callout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span className="eyebrow">Make the directory more useful</span>
            <strong style={{ fontSize: '14.5px', color: 'var(--ink)' }}>Plan your next step or share a youth role.</strong>
          </div>
          <div className="directory-community-actions">
            <a className="secondary-button" href="/roadmap">Build a roadmap <span aria-hidden="true">↗</span></a>
            <a className="text-link" href="/submit-role">Suggest a role <span aria-hidden="true">↗</span></a>
          </div>
        </div>
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
                <span className="search-icon-decor flex items-center justify-center" aria-hidden="true">
                  <MapleLeafIcon className="h-3.5 w-3.5 text-[var(--maple-primary)]" />
                </span>
                <span className="sr-only">Search opportunities</span>
                <input
                  ref={searchInputRef}
                  className="search-input-field"
                  type="search"
                  placeholder="Search by name, organization, or keywords... (Press / to search)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {!query && (
                  <span className="search-shortcut-hint" aria-hidden="true" title="Press / to search">
                    /
                  </span>
                )}
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
                ref={mobileFilterTriggerRef}
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
                {selectedCosts.map((cost) => (
                  <span className="active-filter-tag" key={cost}>
                    {cost}
                    <button
                      type="button"
                      onClick={() => setSelectedCosts((prev) => prev.filter((item) => item !== cost))}
                      aria-label={`Remove ${cost} cost filter`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedFormats.map((format) => (
                  <span className="active-filter-tag" key={format}>
                    {format}
                    <button
                      type="button"
                      onClick={() => setSelectedFormats((prev) => prev.filter((item) => item !== format))}
                      aria-label={`Remove ${format} format filter`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedStatuses.map((status) => (
                  <span className="active-filter-tag" key={status}>
                    {status}
                    <button
                      type="button"
                      onClick={() => setSelectedStatuses((prev) => prev.filter((item) => item !== status))}
                      aria-label={`Remove ${status} availability filter`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedOrganizerCountries.map((country) => (
                  <span className="active-filter-tag" key={country}>
                    {country}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedOrganizerCountries((prev) => prev.filter((item) => item !== country))
                      }
                      aria-label={`Remove ${country} organizer filter`}
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
                  <input
                    className="custom-select city-filter-input"
                    type="search"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    placeholder="e.g. Toronto or online"
                    list="opportunity-city-suggestions"
                    aria-label="Filter by city or area"
                  />
                  <datalist id="opportunity-city-suggestions">
                    {citySuggestions.map((city) => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
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

                <div className="directory-view-toggle" role="tablist" aria-label="Choose catalog view">
                  <button
                    type="button"
                    role="tab"
                    className={viewMode === 'list' ? 'is-active' : ''}
                    aria-selected={viewMode === 'list'}
                    tabIndex={viewMode === 'list' ? 0 : -1}
                    onClick={() => setViewMode('list')}
                  >
                    <span aria-hidden="true">☰</span> List
                  </button>
                  <button
                    type="button"
                    role="tab"
                    className={viewMode === 'map' ? 'is-active' : ''}
                    aria-selected={viewMode === 'map'}
                    tabIndex={viewMode === 'map' ? 0 : -1}
                    onClick={() => setViewMode('map')}
                  >
                    <span aria-hidden="true">🗺</span> Map
                  </button>
                </div>
              </div>
            </div>

            {/* Cards Grid or Empty State */}
            {viewMode === 'map' && filteredOpportunities.length > 0 ? (
              <OpportunityMap opportunities={filteredOpportunities} />
            ) : filteredOpportunities.length > 0 ? (
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
                <div className="w-24 h-24 mb-3 flex items-center justify-center">
                  <MapleTreeEmblem className="w-24 h-24 opacity-80" />
                </div>
                <h3>No matching opportunities found</h3>
                <p>
                  Try broadening your search term or clearing some of your active filters to see more listings across Canada.
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
          onClick={closeMobileFilters}
          role="presentation"
        >
          <div
            ref={mobileFilterSheetRef}
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
                onClose={closeMobileFilters}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
