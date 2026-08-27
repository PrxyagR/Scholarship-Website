/* eslint-disable @next/next/no-html-link-for-pages */
import { catalogUpdatedAt, opportunities } from '../data/opportunities';
import { Eyebrow, SiteFooter, SiteHeader, displayDate } from '../components/site-chrome';

const steps = [
  {
    number: '01',
    title: 'Choose a direction',
    body: 'Start with a broad search, or filter by grade, province, city, study focus, type, and Canada access.',
  },
  {
    number: '02',
    title: 'Read the fit',
    body: 'Open any listing to see what it is, who it is for, where it happens, and what to check before applying.',
  },
  {
    number: '03',
    title: 'Go to the source',
    body: 'Use the official application link to confirm the latest deadline, requirements, registration steps, and details.',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <SiteHeader />
      <main className="inner-page">
        <section className="inner-hero">
          <div className="inner-hero-content">
            <Eyebrow>How MaplePath works</Eyebrow>
            <h1>Less searching.<br /><em>More starting.</em></h1>
            <p>MaplePath is a calm first stop for Canadian high-school students looking for a next step. It helps you narrow the field without pretending to make the decision for you.</p>
          </div>
          <div className="inner-hero-aside">
            <span className="inner-hero-stat">{opportunities.length}<small>+</small></span>
            <span>curated starting points</span>
            <span>for Grades 9–12</span>
          </div>
        </section>

        <section className="guide-section">
          <div className="section-heading guide-heading">
            <div><Eyebrow>Your three-step path</Eyebrow><h2>From curious<br /><em>to ready.</em></h2></div>
            <p className="section-intro">The directory is built to support your judgment, not replace it. Use it to get oriented, then verify every detail at the source.</p>
          </div>
          <div className="guide-grid">
            {steps.map((step) => (
              <article className="guide-card" key={step.number}>
                <span className="guide-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="principles-section">
          <div className="principles-intro"><Eyebrow>What each listing gives you</Eyebrow><h2>A little more<br /><em>clarity.</em></h2></div>
          <div className="principles-grid">
            <div className="principle-card"><span className="principle-icon" aria-hidden="true">#</span><h3>Grade range</h3><p>See which grades the opportunity is intended for. Grade filters match when eligibility overlaps your selection.</p></div>
            <div className="principle-card"><span className="principle-icon" aria-hidden="true">⌖</span><h3>Place and access</h3><p>Find Canada-based, online, and worldwide programs that students in Canada can actually explore.</p></div>
            <div className="principle-card"><span className="principle-icon" aria-hidden="true">◷</span><h3>Deadline signal</h3><p>Upcoming dates are shown when verified. Rolling and annual programs are labelled without guessing an exact date.</p></div>
            <div className="principle-card"><span className="principle-icon" aria-hidden="true">↗</span><h3>Official next step</h3><p>Every opportunity includes a direct official link. The organization’s page is always the final source of truth.</p></div>
          </div>
        </section>

        <section className="review-section">
          <div className="review-card">
            <span className="guide-card-label">The weekly review</span>
            <h2>Curated and<br /><em>growing.</em></h2>
            <p>We search official program, government, university, nonprofit, and organizer pages; verify the fit; update the record; and remove expired dated opportunities from the active catalog.</p>
            <div className="review-card-meta"><span className="status-dot" /> Last catalog review {displayDate(catalogUpdatedAt)}</div>
          </div>
          <div className="review-copy">
            <Eyebrow>One important reminder</Eyebrow>
            <h2>Use MaplePath<br /><em>as your first stop.</em></h2>
            <p>Programs change their rules, dates, locations, and application steps. Before you apply, open the official page and confirm that the opportunity still fits you.</p>
            <a className="primary-button" href="/opportunities">Explore opportunities <span aria-hidden="true">↗</span></a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
