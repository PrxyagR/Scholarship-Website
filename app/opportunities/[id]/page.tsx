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
      <main className={`detail-page accent-${meta.accent}`}>
        <section className="detail-hero">
          <a className="detail-back" href="/opportunities">← Back to all opportunities</a>
          <div className="detail-layout">
            <div className="detail-main">
              <div className="detail-topline">
                <span className="type-badge"><span aria-hidden="true">{meta.icon}</span>{meta.label}</span>
                {opportunity.featured && <span className="featured-label">Worth a look</span>}
              </div>
              <h1>{opportunity.title}</h1>
              <p className="detail-provider">{opportunity.provider}</p>
              <p className="detail-summary">{opportunity.summary}</p>

              <div className="detail-meta-grid">
                <div className="detail-meta">
                  <span className="detail-meta-label">Where</span>
                  <strong>{opportunity.locationLabel}</strong>
                  <span>{opportunity.city} · {opportunity.province}</span>
                </div>
                <div className="detail-meta">
                  <span className="detail-meta-label">Who it’s for</span>
                  <strong>Grades {opportunity.grades.join(' · ')}</strong>
                  <span>Canadian high-school students</span>
                </div>
                <div className="detail-meta">
                  <span className="detail-meta-label">Deadline</span>
                  <strong>{opportunity.deadline.label}</strong>
                  <span>{opportunity.deadline.kind === 'rolling' ? 'Rolling opportunity' : 'Check the official page for current dates'}</span>
                </div>
              </div>

              <div className="detail-section-block">
                <Eyebrow>Eligibility notes</Eyebrow>
                <p className="detail-eligibility">{opportunity.eligibility}</p>
              </div>

              <div className="detail-section-block">
                <Eyebrow>Study focus</Eyebrow>
                <div className="detail-focuses">
                  {opportunity.studyFocus.map((focus) => <span className="topic-tag" key={focus}>{focus}</span>)}
                </div>
              </div>

              <div className="detail-actions">
                <a className="primary-button" href={opportunity.applyUrl} target="_blank" rel="noreferrer">
                  Open official application <span aria-hidden="true">↗</span>
                </a>
                <p>MaplePath is a guide. Confirm the current rules, dates, and application steps on the official page.</p>
              </div>
            </div>

            <aside className="detail-sidebar">
              <div className="detail-sidebar-card">
                <span className="sidebar-card-label">MaplePath check</span>
                <div className="sidebar-check"><span aria-hidden="true">✓</span><strong>Official source</strong><span>Application link goes directly to the organization running this opportunity.</span></div>
                <div className="sidebar-check"><span aria-hidden="true">✓</span><strong>Canada accessible</strong><span>{opportunity.locationLabel}</span></div>
                <div className="sidebar-check"><span aria-hidden="true">✓</span><strong>Recently reviewed</strong><span>{displayDate(opportunity.lastVerified)}</span></div>
              </div>
              <div className="detail-sidebar-card detail-sidebar-note">
                <span className="sidebar-card-label">Next move</span>
                <p>Open the official page, save the deadline somewhere you will see it, and check whether your school or a teacher needs to register you.</p>
              </div>
            </aside>
          </div>
        </section>

        <section className="detail-footer-cta">
          <div><Eyebrow>Keep exploring</Eyebrow><h2>There’s more than<br /><em>one open door.</em></h2></div>
          <a className="secondary-button" href="/opportunities">Browse the full directory <span aria-hidden="true">↗</span></a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
