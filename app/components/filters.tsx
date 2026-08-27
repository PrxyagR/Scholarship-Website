import type { Dispatch, SetStateAction } from 'react';
import type { LocationMode, OpportunityType, StudyFocus } from '../data/opportunities';

export const typeOptions: OpportunityType[] = ['Internship', 'Competition', 'Scholarship'];
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
