/* eslint-disable @next/next/no-html-link-for-pages */
import { catalogUpdatedAt, opportunities } from './data/opportunities';
import { typeMeta } from './components/opportunity-card';
import { Eyebrow, SiteFooter, SiteHeader, displayDate } from './components/site-chrome';

const featuredOpportunities = opportunities.filter((opportunity) => opportunity.featured).slice(0, 3);

function OpportunityTeaser({ opportunity }: { opportunity: (typeof opportunities)[number] }) {
  const meta = typeMeta[opportunity.type];

  return (
    <article className={`teaser-card accent-${meta.accent}`}>
      <div className="teaser-topline">
        <span className="type-badge"><span aria-hidden="true">{meta.icon}</span>{meta.label}</span>
        <span className="teaser-deadline">{opportunity.deadline.label}</span>
      </div>
      <h3><a href={`/opportunities/${opportunity.id}`}>{opportunity.title}</a></h3>
      <p className="card-provider">{opportunity.provider}</p>
      <p className="teaser-summary">{opportunity.summary}</p>
      <div className="teaser-footer">
        <span>Grades {opportunity.grades.join(' · ')}</span>
        <a href={`/opportunities/${opportunity.id}`}>See details <span aria-hidden="true">→</span></a>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="hero home-hero" id="top">
        <div className="hero-copy">
          <Eyebrow>A clearer way forward</Eyebrow>
          <h1>Find the next <em>open door.</em></h1>
          <p className="hero-description">MaplePath brings Canada’s scholarships, internships, and competitions into one calm, useful place — so you can spend less time searching and more time applying.</p>
          <div className="hero-actions">
            <a className="primary-button" href="/opportunities">Explore the directory <span aria-hidden="true">↘</span></a>
            <span className="hero-note"><span aria-hidden="true">✦</span> Curated for Grades 9–12</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="MaplePath catalog snapshot">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="snapshot-card">
            <div className="snapshot-label">The weekly shortlist</div>
            <div className="snapshot-number">{opportunities.length}<span>+</span></div>
            <div className="snapshot-title">real possibilities,<br />one starting point.</div>
            <div className="snapshot-footer"><span className="status-dot" /> Canada-first · online-friendly</div>
          </div>
          <span className="float-label float-label-top">Scholarships <span>◎</span></span>
          <span className="float-label float-label-bottom">Build something <span>✦</span></span>
        </div>
      </section>

      <section className="trust-strip" aria-label="MaplePath principles">
        <div><span className="trust-icon">01</span><span><strong>Official links</strong> Every listing points to its source.</span></div>
        <div><span className="trust-icon">02</span><span><strong>Useful filters</strong> Search by where you are and what you love.</span></div>
        <div><span className="trust-icon">03</span><span><strong>Fresh thinking</strong> The catalog is reviewed every week.</span></div>
      </section>

      <section className="home-feature-section">
        <div className="section-heading">
          <div><Eyebrow>What you can do here</Eyebrow><h2>One place to<br /><em>make a start.</em></h2></div>
          <p className="section-intro">MaplePath is designed to take you from “where do I even look?” to one clear next step.</p>
        </div>
        <div className="home-feature-grid">
          <a className="home-feature" href="/opportunities">
            <span className="feature-number">01</span>
            <span className="feature-icon" aria-hidden="true">⌕</span>
            <h3>Search with purpose</h3>
            <p>Use grade, place, focus, type, and access filters together to find a shorter list that feels relevant.</p>
            <span className="feature-link">Explore filters <span aria-hidden="true">↗</span></span>
          </a>
          <a className="home-feature" href="/opportunities">
            <span className="feature-number">02</span>
            <span className="feature-icon" aria-hidden="true">◎</span>
            <h3>Know what’s next</h3>
            <p>See deadlines, grade ranges, location notes, and eligibility before you leave the directory.</p>
            <span className="feature-link">See the catalog <span aria-hidden="true">↗</span></span>
          </a>
          <a className="home-feature" href="/how-it-works">
            <span className="feature-number">03</span>
            <span className="feature-icon" aria-hidden="true">✦</span>
            <h3>Follow the source</h3>
            <p>Every listing links to the organization, university, government, or organizer running it.</p>
            <span className="feature-link">How it works <span aria-hidden="true">↗</span></span>
          </a>
        </div>
      </section>

      <section className="featured-section">
        <div className="featured-heading">
          <div><Eyebrow>Worth a look</Eyebrow><h2>A few open doors<br /><em>to begin with.</em></h2></div>
          <a className="text-link" href="/opportunities">View all {opportunities.length} opportunities <span aria-hidden="true">↗</span></a>
        </div>
        <div className="teaser-grid">
          {featuredOpportunities.map((opportunity) => <OpportunityTeaser key={opportunity.id} opportunity={opportunity} />)}
        </div>
      </section>

      <section className="home-guide-section">
        <div className="home-guide-copy">
          <Eyebrow>Built for real students</Eyebrow>
          <h2>Find the fit.<br /><em>Keep your agency.</em></h2>
          <p>MaplePath can point you toward an opportunity, but it never replaces your judgment. Always confirm the current rules and deadline on the official page before applying.</p>
          <a className="secondary-button" href="/how-it-works">See how to use MaplePath <span aria-hidden="true">↗</span></a>
        </div>
        <div className="home-guide-card">
          <span className="guide-card-label">Catalog note</span>
          <p>“Curated and growing” means a careful starting point, not a promise that every opportunity in Canada is here.</p>
          <div><span className="status-dot" /> Updated weekly by hand</div>
        </div>
      </section>

      <section className="home-about-card">
        <div><Eyebrow>A student-built project</Eyebrow><h2>More access to<br /><em>good possibilities.</em></h2></div>
        <div><p>MaplePath is a free public directory made to make opportunity-searching feel less overwhelming for Canadian high-school students.</p><a className="text-link" href="/about">Read the story <span aria-hidden="true">↗</span></a></div>
      </section>

      <SiteFooter />
      <span className="sr-only">Catalog last reviewed {displayDate(catalogUpdatedAt)}</span>
    </main>
  );
}
