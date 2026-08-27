import type { Opportunity, OpportunityType } from '../data/opportunities';
import { displayDate } from './site-chrome';

export const typeMeta: Record<OpportunityType, { label: string; accent: string; icon: string }> = {
  Internship: { label: 'Internship', accent: 'coral', icon: '↗' },
  Competition: { label: 'Competition', accent: 'blue', icon: '✦' },
  Scholarship: { label: 'Scholarship', accent: 'gold', icon: '◎' },
};

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
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
      <a className="card-title-link" href={`/opportunities/${opportunity.id}`}>
        <h3>{opportunity.title}</h3>
      </a>
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
        <div className="card-links">
          <a className="details-link" href={`/opportunities/${opportunity.id}`}>
            View details <span aria-hidden="true">→</span>
          </a>
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
      </div>
      <p className="verified-line">Checked {displayDate(opportunity.lastVerified)}</p>
    </article>
  );
}
