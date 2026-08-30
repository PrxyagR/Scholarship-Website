/* eslint-disable @next/next/no-html-link-for-pages */
import { catalogUpdatedAt, opportunities } from '../data/opportunities';
import { Eyebrow, SiteFooter, SiteHeader, displayDate } from '../components/site-chrome';

const steps = [
  {
    number: '01 / DISCOVER',
    title: 'Filter to your exact fit',
    body: 'Filter by your current high school grade, province or territory, study interest, and whether you prefer in-person or online opportunities.',
  },
  {
    number: '02 / EVALUATE',
    title: 'Review eligibility & timeline',
    body: 'Read our concise summaries to check grade restrictions, deadlines, selection criteria, and whether a teacher nomination is required.',
  },
  {
    number: '03 / APPLY',
    title: 'Submit on the official page',
    body: 'Follow direct links to the university, nonprofit, or government organizer hosting the program to submit your official application.',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <SiteHeader />
      <main className="editorial-page-container">
        {/* Page Header */}
        <section className="editorial-hero-banner">
          <div className="editorial-hero-inner">
            <Eyebrow>How MaplePath works</Eyebrow>
            <h1>A clear path from search to application.</h1>
            <p style={{ marginTop: '12px', color: 'var(--ink-soft)', fontSize: '16px', maxWidth: '640px' }}>
              Finding the right extracurriculars, awards, or summer placements shouldn’t feel like searching through dozens of scattered university and government portals.
            </p>
          </div>
        </section>

        {/* 3 Steps Section */}
        <section className="editorial-content-section">
          <div className="section-header-row">
            <div>
              <Eyebrow>The process</Eyebrow>
              <h2>Three simple steps to get started</h2>
            </div>
          </div>

          <div className="steps-list-grid">
            {steps.map((step) => (
              <div className="step-card" key={step.number}>
                <span className="step-card-num">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Listing Standards Section */}
        <section className="editorial-content-section" style={{ paddingTop: '0' }}>
          <div className="section-header-row">
            <div>
              <Eyebrow>Editorial standards</Eyebrow>
              <h2>What each MaplePath listing gives you</h2>
            </div>
          </div>

          <div className="principles-2col-grid">
            <div className="principle-box">
              <div className="principle-box-icon">#</div>
              <h3>Grade Level Precision</h3>
              <p>
                Every listing specifies which high school grades (9 through 12) are eligible, preventing wasted time on university-only or elementary programs.
              </p>
            </div>

            <div className="principle-box">
              <div className="principle-box-icon">⌖</div>
              <h3>Canadian Residency Verification</h3>
              <p>
                We only list programs that Canadian students can participate in—whether locally in your province, nationwide, or through global competitions.
              </p>
            </div>

            <div className="principle-box">
              <div className="principle-box-icon">◷</div>
              <h3>Transparent Deadline Status</h3>
              <p>
                We clearly differentiate between exact application deadlines, recurring annual cycles, and rolling admission dates.
              </p>
            </div>

            <div className="principle-box">
              <div className="principle-box-icon">↗</div>
              <h3>Zero Intermediaries</h3>
              <p>
                You never submit applications through MaplePath. Every opportunity directs you directly to the verified official portal.
              </p>
            </div>
          </div>
        </section>

        {/* Weekly Verification Callout */}
        <section className="guide-banner">
          <div className="guide-banner-card">
            <div>
              <Eyebrow>Curated & Reviewed</Eyebrow>
              <h2>Maintained by weekly manual review</h2>
              <p>
                Our team regularly audits active links, updates deadline schedules, and removes expired competitions so you can explore with confidence.
              </p>
              <a className="secondary-button" href="/opportunities">
                Explore the catalog ({opportunities.length}+ listings) <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="guide-inner-note">
              <span>Catalog Status</span>
              <strong>
                Last reviewed on {displayDate(catalogUpdatedAt)}. All links point to original sources.
              </strong>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
