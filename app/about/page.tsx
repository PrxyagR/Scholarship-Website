/* eslint-disable @next/next/no-html-link-for-pages */
import { catalogUpdatedAt, opportunities } from '../data/opportunities';
import { Eyebrow, SiteFooter, SiteHeader, displayDate } from '../components/site-chrome';

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="editorial-page-container">
        {/* Hero Banner */}
        <section className="editorial-hero-banner">
          <div className="editorial-hero-inner">
            <Eyebrow>About MaplePath</Eyebrow>
            <h1>Leveling the playing field for Canadian high schoolers.</h1>
            <p style={{ marginTop: '12px', color: 'var(--ink-soft)', fontSize: '16px', maxWidth: '680px' }}>
              High school is a critical time to explore passions, build leadership, and prepare for post-secondary education. MaplePath is a free public directory built to ensure every student in Canada has equal access to opportunities.
            </p>
          </div>
        </section>

        {/* The Mission Section */}
        <section className="editorial-content-section">
          <div className="editorial-story-grid">
            <div className="editorial-copy">
              <Eyebrow>The Challenge</Eyebrow>
              <h2>Why opportunity information is broken</h2>
              <p>
                Prestigious scholarships, university math contests, science internships, and leadership summits are often buried deep within departmental websites or passed down informally through select private school clubs.
              </p>
              <p>
                Students who attend smaller community high schools, rural districts, or who are the first in their family to consider higher education frequently miss out simply because they never knew these programs existed.
              </p>
              <p>
                MaplePath solves this by bringing verified scholarships, internships, and competitions into one centralized, public catalog—organized by province, grade, and interest.
              </p>
            </div>

            <div className="editorial-stat-card-stack">
              <div className="editorial-stat-card">
                <strong>100% Free & Open</strong>
                <p>No paywalls or hidden fees. Anyone can browse the entire directory instantly; an optional account helps us measure reach.</p>
              </div>
              <div className="editorial-stat-card">
                <strong>Canada-Focused</strong>
                <p>Designed specifically for Canadian high school students in Grades 9 through 12.</p>
              </div>
              <div className="editorial-stat-card">
                <strong>Direct Official Sources</strong>
                <p>We link directly to official program organizers, universities, and government bodies.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Standards Section */}
        <section className="editorial-content-section" style={{ paddingTop: '0' }}>
          <div className="section-header-row">
            <div>
              <Eyebrow>Integrity & Curation</Eyebrow>
              <h2>Our curation criteria</h2>
            </div>
          </div>

          <div className="principles-2col-grid">
            <div className="principle-box">
              <div className="principle-box-icon">✓</div>
              <h3>Verified Legitimacy</h3>
              <p>
                Every listing is verified to be hosted by accredited Canadian universities, registered charities, established nonprofits, or government initiatives. We do not accept unverified commercial promotions or lead-generation scams.
              </p>
            </div>

            <div className="principle-box">
              <div className="principle-box-icon">📅</div>
              <h3>Active Maintenance</h3>
              <p>
                We conduct weekly audits to ensure dead links are corrected, expired cycles are archived, and new seasonal opportunities are promptly added to the active index.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="guide-banner">
          <div className="guide-banner-card">
            <div>
              <Eyebrow>Get Started</Eyebrow>
              <h2>Find an opportunity worth pursuing</h2>
              <p>
                Explore our directory of {opportunities.length}+ vetted opportunities and take the next step in your high school journey.
              </p>
              <a className="secondary-button" href="/opportunities">
                Browse all opportunities <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="guide-inner-note">
              <span>Weekly Updates</span>
              <strong>
                Catalog last verified on {displayDate(catalogUpdatedAt)}.
              </strong>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
