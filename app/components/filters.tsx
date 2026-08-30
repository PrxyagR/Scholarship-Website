import type { Dispatch, SetStateAction } from 'react';
import type { LocationMode, OpportunityType, StudyFocus } from '../data/opportunities';

export const typeOptions: OpportunityType[] = ['Scholarship', 'Competition', 'Internship'];
export const gradeOptions = [9, 10, 11, 12];
export const provinceOptions = [
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
export const accessOptions: LocationMode[] = ['Canada', 'Online', 'Worldwide'];
export const focusOptions: StudyFocus[] = [
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
      <legend className="filter-group-legend">{title}</legend>
      <div className="filter-chips-list">
        {options.map((option) => {
          const key = String(option);
          const isSelected = selected.includes(option);
          return (
            <label
              className={`filter-chip-label ${isSelected ? 'is-selected' : ''}`}
              key={key}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(option)}
                aria-label={`${title}: ${optionLabel ? optionLabel(option) : key}`}
              />
              <span>{optionLabel ? optionLabel(option) : key}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FilterPanel({
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
  totalCount,
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
  totalCount?: number;
}) {
  const toggle = <T,>(value: T, setter: Dispatch<SetStateAction<T[]>>) => {
    setter((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  const hasFilters =
    selectedTypes.length > 0 ||
    selectedProvinces.length > 0 ||
    selectedGrades.length > 0 ||
    selectedFocuses.length > 0 ||
    selectedLocations.length > 0;

  return (
    <div className={`filters-panel-content ${mobile ? 'is-mobile' : ''}`}>
      <div className="filters-header">
        <h2 className="filters-title">Filter by</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {hasFilters && (
            <button className="reset-button" type="button" onClick={onReset}>
              Reset all
            </button>
          )}
          {mobile && onClose && (
            <button
              className="close-sheet-btn"
              type="button"
              onClick={onClose}
              aria-label="Close filter drawer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <FilterGroup
        title="Opportunity type"
        options={typeOptions}
        selected={selectedTypes}
        onToggle={(value) => toggle(value as OpportunityType, setSelectedTypes)}
      />

      <FilterGroup
        title="Grade level"
        options={gradeOptions}
        selected={selectedGrades}
        onToggle={(value) => toggle(value as number, setSelectedGrades)}
        optionLabel={(value) => `Grade ${value}`}
      />

      <FilterGroup
        title="Study focus"
        options={focusOptions}
        selected={selectedFocuses}
        onToggle={(value) => toggle(value as StudyFocus, setSelectedFocuses)}
      />

      <FilterGroup
        title="Access & location"
        options={accessOptions}
        selected={selectedLocations}
        onToggle={(value) => toggle(value as LocationMode, setSelectedLocations)}
        optionLabel={(value) =>
          value === 'Canada'
            ? 'Canada-based'
            : value === 'Online'
            ? 'Online only'
            : 'Worldwide (Canada eligible)'
        }
      />

      <FilterGroup
        title="Province or territory"
        options={provinceOptions}
        selected={selectedProvinces}
        onToggle={(value) => toggle(value as string, setSelectedProvinces)}
      />

      {mobile && (
        <div style={{ marginTop: '24px' }}>
          <button className="mobile-filter-done-btn" type="button" onClick={onClose}>
            {totalCount !== undefined
              ? `Show ${totalCount} ${totalCount === 1 ? 'Opportunity' : 'Opportunities'} →`
              : 'Apply filters'}
          </button>
        </div>
      )}
    </div>
  );
}
