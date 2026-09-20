import {
  getOpportunityCost,
  getOpportunityFormat,
  getOpportunityStatus,
  type Opportunity,
  type OpportunityType,
} from '../data/opportunities';
import { SaveOpportunityButton } from './save-opportunity-button';
import { displayDate } from './site-chrome';
import { MapleLeafIcon } from './brand-motif';

export const typeMeta: Record<
  OpportunityType,
  { label: string; badgeClass: string; icon: string }
> = {
  Scholarship: { label: 'Scholarship', badgeClass: 'badge-scholarship', icon: '◎' },
  Competition: { label: 'Competition', badgeClass: 'badge-competition', icon: '✦' },
  Internship: { label: 'Internship', badgeClass: 'badge-internship', icon: '↗' },
  Program: { label: 'Program', badgeClass: 'badge-program', icon: '▦' },
  'Youth role': { label: 'Youth role', badgeClass: 'badge-youth-role', icon: '＋' },
};

export function OpportunityCard({
  opportunity,
  initialSaved = false,
  isAuthenticated = false,
  returnTo = '/opportunities',
}: {
  opportunity: Opportunity;
  initialSaved?: boolean;
  isAuthenticated?: boolean;
  returnTo?: string;
}) {
  const meta = typeMeta[opportunity.type];

  return (
    <article className="opportunity-card-item">
      <div className="card-top-row">
        <span className={`card-type-badge ${meta.badgeClass}`}>
          <span aria-hidden="true">{meta.icon}</span>
          {meta.label}
        </span>
        <div className="card-top-actions">
          {opportunity.deadline.kind === 'rolling' ? (
            <span className="card-urgency-pill urgency-rolling">⚡ Rolling</span>
          ) : opportunity.deadline.kind === 'cycle' ? (
            <span className="card-urgency-pill urgency-cycle">🔄 Annual cycle</span>
          ) : (
            <span className="card-urgency-pill urgency-open">📅 {opportunity.deadline.label}</span>
          )}
          {opportunity.featured && <span className="card-featured-pill">★ Featured</span>}
          <SaveOpportunityButton
            opportunityId={opportunity.id}
            opportunityTitle={opportunity.title}
            initialSaved={initialSaved}
            isAuthenticated={isAuthenticated}
            returnTo={returnTo}
          />
        </div>
      </div>

      <div className="card-title-heading">
        <h3>
          <a href={`/opportunities/${opportunity.id}`}>{opportunity.title}</a>
        </h3>
      </div>
      <p className="card-provider-text">{opportunity.provider}</p>

      <div className="card-meta-list">
        <div className="card-meta-item">
          <span className="card-meta-icon flex items-center justify-center" aria-hidden="true">
            {opportunity.locationMode === 'Canada' || opportunity.province === 'National' ? (
              <MapleLeafIcon className="h-3 w-3 text-[var(--maple-primary)]" />
            ) : (
              '⌖'
            )}
          </span>
          <span>{opportunity.locationLabel}</span>
        </div>
        <div className="card-meta-item">
          <span className="card-meta-icon" aria-hidden="true">
            #
          </span>
          <span>Grades {opportunity.grades.join(' · ')}</span>
        </div>
        <div className="card-meta-item">
          <span className="card-meta-icon" aria-hidden="true">
            ◷
          </span>
          <span>{opportunity.deadline.label} · {getOpportunityStatus(opportunity)}</span>
        </div>
        <div className="card-meta-item">
          <span className="card-meta-icon" aria-hidden="true">
            ◇
          </span>
          <span>
            {getOpportunityCost(opportunity)} · {getOpportunityFormat(opportunity)}
          </span>
        </div>
        {opportunity.travelRequired && (
          <div className="card-meta-item card-meta-travel">
            <span className="card-meta-icon" aria-hidden="true">✈</span>
            <span>Travel may be required</span>
          </div>
        )}
      </div>

      <p className="card-summary-text">{opportunity.summary}</p>

      <div className="card-eligibility-box">
        <strong>Eligibility:</strong> {opportunity.eligibility}
      </div>

      <div className="card-tags-row" aria-label="Study fields">
        {opportunity.studyFocus.slice(0, 3).map((focus) => (
          <span className="card-focus-tag" key={focus}>
            {focus}
          </span>
        ))}
      </div>

      <div className="card-footer-actions">
        <a className="card-details-btn" href={`/opportunities/${opportunity.id}`}>
          View details <span aria-hidden="true">→</span>
        </a>
        <a
          className="card-apply-btn"
          href={opportunity.applyUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open official application page for ${opportunity.title}`}
        >
          Official page <span aria-hidden="true">↗</span>
        </a>
      </div>

      <p className="card-verified-line flex items-center justify-center gap-1.5">
        <MapleLeafIcon className="h-3 w-3 text-[var(--spruce-primary)] opacity-75 inline flex-shrink-0" />
        <span>Verified {displayDate(opportunity.lastVerified)}</span>
      </p>
    </article>
  );
}
