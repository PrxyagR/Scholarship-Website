/* eslint-disable @next/next/no-html-link-for-pages */
import { catalogUpdatedAt, opportunities } from './data/opportunities';
import { typeMeta } from './components/opportunity-card';
import { Eyebrow, SiteFooter, SiteHeader, displayDate } from './components/site-chrome';

const featuredOpportunities = opportunities
  .filter((opportunity) => opportunity.featured)
  .slice(0, 4);

function OpportunityTeaser({ opportunity }: { opportunity: (typeof opportunities)[number] }) {
  const meta = typeMeta[opportunity.type];

  return (
    <article className="opportunity-card-item">
      <div className="card-top-row">
        <span className={`card-type-badge ${meta.badgeClass}`}>
          <span aria-hidden="true">{meta.icon}</span>
          {meta.label}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
          {opportunity.deadline.label}
        </span>
      </div>
      <div className="card-title-heading">
        <h3>
          <a href={`/opportunities/${opportunity.id}`}>{opportunity.title}</a>
        </h3>
      </div>
      <p className="card-provider-text">{opportunity.provider}</p>
      <p className="card-summary-text">{opportunity.summary}</p>
      <div className="card-footer-actions">
        <span style={{ fontSize: '12px', color: 'var(--ink-muted)', fontWeight: 600 }}>
          Grades {opportunity.grades.join(' · ')}
        </span>
        <a className="text-link" href={`/opportunities/${opportunity.id}`}>
          View listing <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

export default function Home() {
  const scholarshipCount = opportunities.filter((o) => o.type === 'Scholarship').length;
  const competitionCount = opportunities.filter((o) => o.type === 'Competition').length;
  const internshipCount = opportunities.filter((o) => o.type === 'Internship').length;

  return (
    <main>
      <SiteHeader />

      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <Eyebrow>Free Canadian student directory</Eyebrow>
            <h1>
              Find scholarships, internships & competitions in Canada.
            </h1>
            <p className="hero-description">
              MaplePath gathers vetted high-school opportunities into one simple, searchable catalog. Filter by province, grade, study focus, and access mode to find your next step.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="/opportunities">
                Explore catalog <span aria-hidden="true">↗</span>
              </a>
              <a className="secondary-button" href="/how-it-works">
                How it works
              </a>
              <span className="hero-badge">
                <span className="hero-badge-dot" aria-hidden="true" />
                Grades 9–12 · All 13 provinces & territories
              </span>
            </div>
          </div>

          <div className="hero-card" aria-label="Directory overview">
            <div className="hero-card-header">
              <span className="hero-card-title">Directory Overview</span>
              <span className="hero-card-status">
                <span className="status-dot" /> Hand-reviewed
              </span>
            </div>
            <div className="hero-card-stats">
              <div className="hero-stat-item">
                <span className="hero-stat-number">{opportunities.length}</span>
                <span className="hero-stat-label">Total Listings</span>
              </div>
              <div className="hero-stat-item">
                <span className="hero-stat-number">{scholarshipCount}</span>
                <span className="hero-stat-label">Scholarships</span>
              </div>
              <div className="hero-stat-item">
                <span className="hero-stat-number">{competitionCount + internshipCount}</span>
                <span className="hero-stat-label">Contests & Interns</span>
              </div>
            </div>
            <div className="hero-card-footer">
              <span>Latest verification cycle</span>
              <strong>{displayDate(catalogUpdatedAt)}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Principles Bar */}
      <section className="trust-bar" aria-label="MaplePath commitments">
        <div className="trust-bar-inner">
          <div className="trust-item">
            <div className="trust-icon-box" aria-hidden="true">
              ✓
            </div>
            <div className="trust-item-text">
              <strong>100% Free & Open</strong>
              <span>No accounts, fees, paywalls, or gated forms.</span>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box" aria-hidden="true">
              ↗
            </div>
            <div className="trust-item-text">
              <strong>Direct Official Links</strong>
              <span>Every listing points directly to the organizer.</span>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box" aria-hidden="true">
              🍁
            </div>
            <div className="trust-item-text">
              <strong>Canada-First Catalog</strong>
              <span>Built specifically for high school students in Canada.</span>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Discover Section */}
      <section className="section-wrapper">
        <div className="section-header-row">
          <div>
            <Eyebrow>What you will find</Eyebrow>
            <h2>Three pathways for high schoolers</h2>
          </div>
          <p className="section-header-intro">
            Whether you are preparing for university applications, building hands-on skills, or looking to fund your education.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-box">
            <span className="feature-box-number">01 / AWARDS</span>
            <h3>Scholarships & Bursaries</h3>
            <p>
              Merit awards, community leadership grants, STEM scholarships, and bursaries open to Canadian secondary school students.
            </p>
            <a className="feature-box-link" href="/opportunities">
              Browse scholarships <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="feature-box">
            <span className="feature-box-number">02 / CHALLENGES</span>
            <h3>Academic Competitions</h3>
            <p>
              Math olympiads, computing challenges, science fairs, writing contests, and business pitch competitions with national recognition.
            </p>
            <a className="feature-box-link" href="/opportunities">
              Browse competitions <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="feature-box">
            <span className="feature-box-number">03 / EXPERIENCE</span>
            <h3>Internships & Programs</h3>
            <p>
              Summer research placements, youth government councils, hospital internships, and nonprofit fellowships for motivated students.
            </p>
            <a className="feature-box-link" href="/opportunities">
              Browse internships <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Opportunities Section */}
      <section className="featured-band">
        <div className="featured-band-inner">
          <div className="section-header-row">
            <div>
              <Eyebrow>Curated Highlights</Eyebrow>
              <h2>Notable upcoming opportunities</h2>
            </div>
            <a className="text-link" href="/opportunities">
              View all {opportunities.length} opportunities <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="opportunities-grid">
            {featuredOpportunities.map((opportunity) => (
              <OpportunityTeaser key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Guide Banner */}
      <section className="guide-banner">
        <div className="guide-banner-card">
          <div>
            <Eyebrow>Student Guide</Eyebrow>
            <h2>Always verify with the official host</h2>
            <p>
              MaplePath acts as your starting point. Because application deadlines, eligibility criteria, and submission rules can evolve, always double-check requirements on the host organization’s website before submitting.
            </p>
            <a className="secondary-button" href="/how-it-works">
              Read our application guide <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="guide-inner-note">
            <span>Weekly Verification</span>
            <strong>
              “Every listing is checked for active official links, grade eligibility, and accurate deadline indicators.”
            </strong>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
