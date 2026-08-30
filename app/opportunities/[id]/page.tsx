/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { opportunities } from '../../data/opportunities';
import { typeMeta } from '../../components/opportunity-card';
import { Eyebrow, SiteFooter, SiteHeader, displayDate } from '../../components/site-chrome';

type OpportunityPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return opportunities.map((opportunity) => ({ id: opportunity.id }));
}

export async function generateMetadata({ params }: OpportunityPageProps): Promise<Metadata> {
  const { id } = await params;
  const opportunity = opportunities.find((item) => item.id === id);

  if (!opportunity) {
    return {
      title: 'Opportunity not found | MaplePath',
      description: 'This MaplePath opportunity could not be found.',
    };
  }

  const title = `${opportunity.title} | MaplePath`;
  return {
    title,
    description: opportunity.summary,
    openGraph: {
      title,
      description: opportunity.summary,
      type: 'article',
      images: [],
    },
    twitter: {
      card: 'summary',
      title,
      description: opportunity.summary,
      images: [],
    },
  };
}

export default async function OpportunityDetailPage({ params }: OpportunityPageProps) {
  const { id } = await params;
  const opportunity = opportunities.find((item) => item.id === id);

  if (!opportunity) notFound();

  const meta = typeMeta[opportunity.type];

  return (
    <>
      <SiteHeader />
      <main className="detail-page-container">
        {/* Back Link */}
        <a className="detail-back-link" href="/opportunities">
          <span aria-hidden="true">←</span> Back to all opportunities
        </a>

        <div className="detail-layout-grid">
          {/* Main Content */}
          <div className="detail-main-content">
            <div className="card-top-row" style={{ justifyContent: 'flex-start', gap: '8px' }}>
              <span className={`card-type-badge ${meta.badgeClass}`}>
                <span aria-hidden="true">{meta.icon}</span>
                {meta.label}
              </span>
              {opportunity.featured && (
                <span className="card-featured-pill">Featured</span>
              )}
            </div>

            <h1>{opportunity.title}</h1>
            <p className="detail-provider-heading">{opportunity.provider}</p>

            <p className="detail-lead-summary">{opportunity.summary}</p>

            {/* Metadata 3-Box Row */}
            <div className="detail-meta-cards-row">
              <div className="detail-meta-col">
                <span className="detail-meta-label">Location / Access</span>
                <span className="detail-meta-value">{opportunity.locationLabel}</span>
                <span className="detail-meta-hint">
                  {opportunity.city} · {opportunity.province}
                </span>
              </div>
              <div className="detail-meta-col">
                <span className="detail-meta-label">Grade Eligibility</span>
                <span className="detail-meta-value">Grades {opportunity.grades.join(' · ')}</span>
                <span className="detail-meta-hint">Canadian high school students</span>
              </div>
              <div className="detail-meta-col">
                <span className="detail-meta-label">Application Timeline</span>
                <span className="detail-meta-value">{opportunity.deadline.label}</span>
                <span className="detail-meta-hint">
                  {opportunity.deadline.kind === 'rolling'
                    ? 'Rolling review cycle'
                    : 'Check official page for exact cutoff'}
                </span>
              </div>
            </div>

            {/* Eligibility Section */}
            <div className="detail-section-block">
              <Eyebrow>Eligibility & Requirements</Eyebrow>
              <p className="detail-eligibility-text">{opportunity.eligibility}</p>
            </div>

            {/* Study Focus Section */}
            <div className="detail-section-block">
              <Eyebrow>Field of Study</Eyebrow>
              <div className="card-tags-row" style={{ marginTop: '8px' }}>
                {opportunity.studyFocus.map((focus) => (
                  <span className="card-focus-tag" key={focus}>
                    {focus}
                  </span>
                ))}
              </div>
            </div>

            {/* Apply Action Box */}
            <div className="detail-apply-box">
              <a
                className="primary-button"
                href={opportunity.applyUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open official application page for ${opportunity.title}`}
              >
                Open official program page <span aria-hidden="true">↗</span>
              </a>
              <p className="detail-apply-disclaimer">
                MaplePath directs you to the official source. Always confirm current rules, deadlines, and registration instructions directly on the host website.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="detail-sidebar-wrap">
            <div className="detail-sidebar-card">
              <span className="eyebrow" style={{ marginBottom: '8px' }}>
                Verification checks
              </span>
              <div className="sidebar-check-item">
                <span className="sidebar-check-icon" aria-hidden="true">
                  ✓
                </span>
                <div>
                  <strong>Direct Official Link</strong>
                  <span>Links to verified organizer portal</span>
                </div>
              </div>
              <div className="sidebar-check-item">
                <span className="sidebar-check-icon" aria-hidden="true">
                  ✓
                </span>
                <div>
                  <strong>Canada Accessible</strong>
                  <span>{opportunity.locationLabel}</span>
                </div>
              </div>
              <div className="sidebar-check-item">
                <span className="sidebar-check-icon" aria-hidden="true">
                  ✓
                </span>
                <div>
                  <strong>Recently Reviewed</strong>
                  <span>Verified {displayDate(opportunity.lastVerified)}</span>
                </div>
              </div>
            </div>

            <div className="detail-sidebar-card" style={{ background: 'var(--paper-subtle)' }}>
              <span className="eyebrow" style={{ marginBottom: '8px' }}>
                Helpful Tips
              </span>
              <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                Bookmark the official link and calendar the deadline early. If a school nomination or teacher reference is required, reach out to your counselor at least 3 weeks before the cutoff date.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
