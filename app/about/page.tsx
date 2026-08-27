/* eslint-disable @next/next/no-html-link-for-pages */
import { catalogUpdatedAt, opportunities } from '../data/opportunities';
import { Eyebrow, SiteFooter, SiteHeader, displayDate } from '../components/site-chrome';

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="inner-page about-page">
        <section className="inner-hero about-hero">
          <div className="inner-hero-content">
            <Eyebrow>About MaplePath</Eyebrow>
            <h1>Opportunity should<br /><em>feel findable.</em></h1>
            <p>MaplePath is a free, public, student-built directory for Canadian high-school students in Grades 9–12 — a place to begin when the internet feels too scattered and the next step feels too big.</p>
          </div>
          <div className="inner-hero-aside about-aside">
            <span className="inner-hero-stat">{opportunities.length}<small>+</small></span>
            <span>opportunities in the</span>
            <span>first curated catalog</span>
          </div>
        </section>

        <section className="about-story-section">
          <div className="about-story-copy">
            <Eyebrow>Why it exists</Eyebrow>
            <h2>Good information<br /><em>should travel.</em></h2>
            <p>Scholarships, internships, and competitions are often spread across university websites, government pages, nonprofit portals, and organizer calendars. That can make finding an opportunity feel like an opportunity in itself.</p>
            <p>MaplePath gathers a carefully reviewed starting point into one simple directory. It is meant to help more students see what is possible — especially students who do not already know where to look.</p>
          </div>
          <div className="about-stat-stack">
            <div className="about-stat"><strong>01</strong><span>Free to browse</span><p>No account, paywall, or application fee added by MaplePath.</p></div>
            <div className="about-stat"><strong>02</strong><span>Canada-first</span><p>Local opportunities plus online and worldwide options accessible from Canada.</p></div>
            <div className="about-stat"><strong>03</strong><span>Source-led</span><p>The official program page is always the final source of truth.</p></div>
          </div>
        </section>

        <section className="about-promise-section">
          <div className="promise-heading"><Eyebrow>The editorial promise</Eyebrow><h2>Useful, honest,<br /><em>and growing.</em></h2></div>
          <div className="promise-grid">
            <article><span>01</span><h3>Useful enough to act on</h3><p>Each listing includes the details students need to decide whether it is worth opening the official page.</p></article>
            <article><span>02</span><h3>Honest about its limits</h3><p>“Curated and growing” is a careful starting point, not a promise that every Canadian opportunity is here.</p></article>
            <article><span>03</span><h3>Maintained by hand</h3><p>The catalog is checked weekly for eligibility, Canada access, dates, and working official links.</p></article>
          </div>
        </section>

        <section className="about-final-section">
          <div><Eyebrow>Start where you are</Eyebrow><h2>There is no perfect<br /><em>first step.</em></h2></div>
          <div><p>Choose a filter that feels helpful, open a listing that catches your attention, and let the official source guide the rest.</p><p className="about-reviewed">Catalog last reviewed {displayDate(catalogUpdatedAt)}</p><a className="primary-button" href="/opportunities">Browse the directory <span aria-hidden="true">↗</span></a></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
