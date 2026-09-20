/* eslint-disable @next/next/no-html-link-for-pages */
import {
  catalogUpdatedAt,
  opportunities,
  supportedProvinces,
  type Opportunity,
} from './data/opportunities';
import { typeMeta } from './components/opportunity-card';
import { SaveOpportunityButton } from './components/save-opportunity-button';
import { Eyebrow, SiteFooter, SiteHeader, displayDate } from './components/site-chrome';
import { MapleLeafCanvas } from './components/maple-leaf-canvas';
import { InteractiveMatchFinder } from './components/interactive-match-finder';
import { FaqAccordion } from './components/faq-accordion';
import { TreeGrowthStage, MapleLeafIcon } from './components/brand-motif';
import { getSavedOpportunityState } from '@/lib/saved-opportunities';

export const dynamic = 'force-dynamic';

const featuredOpportunities = opportunities
  .filter((opportunity) => opportunity.featured)
  .slice(0, 4);

const provinceCodes: Record<string, string> = {
  National: 'CA',
  'Multiple provinces': 'Multi',
  'Online / worldwide': 'Web',
  Alberta: 'AB',
  'British Columbia': 'BC',
  Manitoba: 'MB',
  'New Brunswick': 'NB',
  'Newfoundland and Labrador': 'NL',
  'Nova Scotia': 'NS',
  Ontario: 'ON',
  'Prince Edward Island': 'PE',
  Quebec: 'QC',
  Saskatchewan: 'SK',
  'Northwest Territories': 'NT',
  Nunavut: 'NU',
  Yukon: 'YT',
};

function OpportunityTeaser({
  opportunity,
  initialSaved,
  isAuthenticated,
}: {
  opportunity: Opportunity;
  initialSaved: boolean;
  isAuthenticated: boolean;
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
          <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
            {opportunity.deadline.label}
          </span>
          <SaveOpportunityButton
            opportunityId={opportunity.id}
            opportunityTitle={opportunity.title}
            initialSaved={initialSaved}
            isAuthenticated={isAuthenticated}
            returnTo="/"
          />
        </div>
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

export default async function Home() {
  const { user, savedIds } = await getSavedOpportunityState();
  const scholarshipCount = opportunities.filter((o) => o.type === 'Scholarship').length;
  const competitionCount = opportunities.filter((o) => o.type === 'Competition').length;
  const internshipCount = opportunities.filter((o) => o.type === 'Internship').length;
  const programCount = opportunities.filter(
    (o) => o.type === 'Program' || o.type === 'Youth role',
  ).length;

  const spotlightOpportunity =
    opportunities.find((o) => o.id === 'loran-scholarship') ?? opportunities[0];
  const spotlightMeta = typeMeta[spotlightOpportunity.type];

  return (
    <main>
      <SiteHeader />

      {/* Hero Section with Interactive Maple Leaf Canvas */}
      <div className="maple-hero-container">
        <MapleLeafCanvas />

        <section className="home-hero relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-10 items-stretch">

            {/* Hero Left: Copy (Order 1 on mobile, 7 cols on desktop) */}
            <div className="hero-copy order-1 lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="hero-status-pill">
                  <span className="status-dot flex-shrink-0" aria-hidden="true" />
                  <span className="hidden sm:inline">🍁 Canada’s Free Student Directory · Grades 9–12 · Verified Weekly</span>
                  <span className="sm:hidden">🍁 Free Student Directory · Grades 9–12</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--ink-strong)] leading-[1.14]">
                  Find Canada’s Best High-School Opportunities.
                </h1>

                <p className="hero-description text-base sm:text-lg text-[var(--ink-body)] leading-relaxed mt-3">
                  A verified, friction-free directory of scholarships, research internships, academic competitions, and youth councils across all 10 provinces & 3 territories. 100% free and open.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[var(--ink-muted)]">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--forest)] flex-shrink-0" />
                  All 10 provinces & 3 territories
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--forest)] flex-shrink-0" />
                  No paywalls or logins required
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--forest)] flex-shrink-0" />
                  Direct official host portals
                </span>
              </div>
            </div>

            {/* Hero Right: Spotlight Card & Directory Pulse (Order 3 on mobile, 5 cols on desktop) */}
            <div className="order-3 lg:order-2 lg:col-span-5 mt-6 lg:mt-0">
              <div className="hero-card" aria-label="Directory pulse and spotlight">
                <div className="hero-card-header">
                  <span className="hero-card-title">Directory Spotlight</span>
                  <span className="hero-card-status">
                    <span className="status-dot" /> Verified Active
                  </span>
                </div>

                {/* Spotlight Card Preview */}
                <div className="hero-spotlight-item">
                  <div className="hero-spotlight-top">
                    <span className={`card-type-badge ${spotlightMeta.badgeClass}`}>
                      <span aria-hidden="true">{spotlightMeta.icon}</span>
                      {spotlightMeta.label}
                    </span>
                    <span className="hero-spotlight-badge">Major Award</span>
                  </div>

                  <h2 className="hero-spotlight-title">
                    <a href={`/opportunities/${spotlightOpportunity.id}`}>{spotlightOpportunity.title}</a>
                  </h2>
                  <p className="hero-spotlight-provider">{spotlightOpportunity.provider}</p>
                  <p className="hero-spotlight-desc">{spotlightOpportunity.summary}</p>

                  <div className="hero-spotlight-footer">
                    <div>
                      <span style={{ color: 'var(--ink-muted)', fontSize: '11.5px', display: 'block' }}>
                        Deadline
                      </span>
                      <strong style={{ color: 'var(--forest)', fontSize: '12.5px' }}>
                        {spotlightOpportunity.deadline.label}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <SaveOpportunityButton
                        opportunityId={spotlightOpportunity.id}
                        opportunityTitle={spotlightOpportunity.title}
                        initialSaved={savedIds.includes(spotlightOpportunity.id)}
                        isAuthenticated={Boolean(user)}
                        returnTo="/"
                      />
                      <a className="card-details-btn" href={`/opportunities/${spotlightOpportunity.id}`}>
                        Preview <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Live Catalog Metrics */}
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
                    <span className="hero-stat-number">
                      {competitionCount + internshipCount + programCount}
                    </span>
                    <span className="hero-stat-label">Contests & Interns</span>
                  </div>
                </div>

                <div className="hero-card-footer">
                  <span>Weekly review cycle</span>
                  <strong>{displayDate(catalogUpdatedAt)}</strong>
                </div>
              </div>
            </div>

            {/* Instant Match Navigator: Order 2 on mobile (immediate search), Spans 12 cols on desktop */}
            <div className="order-2 lg:order-3 lg:col-span-12 mt-4 lg:mt-6">
              <InteractiveMatchFinder catalog={opportunities} />
            </div>

          </div>
        </section>
      </div>

      {/* Trust Principles Bar */}
      <section className="trust-bar animate-fade-up delay-200" aria-label="MaplePath commitments">
        <div className="trust-bar-inner">
          <div className="trust-item">
            <div className="trust-icon-box" aria-hidden="true">
              ✓
            </div>
            <div className="trust-item-text">
              <strong>100% Free & Open Access</strong>
              <span>No fees, paywalls, or accounts required to browse and filter every listing.</span>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box" aria-hidden="true">
              ↗
            </div>
            <div className="trust-item-text">
              <strong>Direct Official Links</strong>
              <span>Zero middlemen or data brokers. Every link leads directly to the official host.</span>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box flex items-center justify-center" aria-hidden="true">
              <MapleLeafIcon className="h-4 w-4 text-[var(--maple-primary)]" />
            </div>
            <div className="trust-item-text">
              <strong>Canada-First Catalog</strong>
              <span>Built specifically for secondary students across Canadian provinces and territories.</span>
            </div>
          </div>
        </div>
      </section>

      {/* High-School Journey Milestones (Grades 9–12) */}
      <section className="section-wrapper">
        <div className="section-header-row">
          <div>
            <Eyebrow>Grade-by-Grade Strategy</Eyebrow>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-strong)]">
              How High-School Opportunities Evolve Each Year
            </h2>
          </div>
          <p className="section-header-intro">
            A successful trajectory starts with curiosity in Grade 9 and culminates in major national scholarships in Grade 12.
          </p>
        </div>

        <div className="journey-timeline-grid">
          {/* Grade 9 */}
          <div className="journey-milestone-card">
            <div>
              <span className="journey-grade-badge flex items-center gap-1.5">
                <TreeGrowthStage grade={9} className="h-4 w-4" />
                <span>Grade 9 · Foundations</span>
              </span>
              <h3 className="journey-card-title">Spark Curiosity & Exploration</h3>
              <p className="journey-card-desc">
                Begin with low-stakes math contests (Beaver Computing, Pascal), school clubs, municipal youth advisory tables, and community volunteering. Discover what genuinely excites you.
              </p>
            </div>
            <div>
              <div className="journey-card-focus">
                <strong>Key Focus:</strong> Exploring interests without pressure
              </div>
              <a href="/opportunities?grade=9" className="journey-card-link">
                Grade 9 Opportunities <span>→</span>
              </a>
            </div>
          </div>

          {/* Grade 10 */}
          <div className="journey-milestone-card">
            <div>
              <span className="journey-grade-badge flex items-center gap-1.5">
                <TreeGrowthStage grade={10} className="h-4 w-4" />
                <span>Grade 10 · Deepening</span>
              </span>
              <h3 className="journey-card-title">Hands-On STEM & Early Leadership</h3>
              <p className="journey-card-desc">
                Apply for selective summer programs (Shad Canada, Deep River Science), regional science fairs (CWSF qualifiers), and step into club executive or student council positions.
              </p>
            </div>
            <div>
              <div className="journey-card-focus">
                <strong>Key Focus:</strong> First research experience & team roles
              </div>
              <a href="/opportunities?grade=10" className="journey-card-link">
                Grade 10 Opportunities <span>→</span>
              </a>
            </div>
          </div>

          {/* Grade 11 */}
          <div className="journey-milestone-card">
            <div>
              <span className="journey-grade-badge flex items-center gap-1.5">
                <TreeGrowthStage grade={11} className="h-4 w-4" />
                <span>Grade 11 · Acceleration</span>
              </span>
              <h3 className="journey-card-title">Pre-University Rigour & Research</h3>
              <p className="journey-card-desc">
                Compete in senior olympiads (Fermat, Euclid, Sir Isaac Newton), apply for university lab internships, and represent your riding in Provincial Youth Parliaments.
              </p>
            </div>
            <div>
              <div className="journey-card-focus">
                <strong>Key Focus:</strong> Standout profile building & faculty mentors
              </div>
              <a href="/opportunities?grade=11" className="journey-card-link">
                Grade 11 Opportunities <span>→</span>
              </a>
            </div>
          </div>

          {/* Grade 12 */}
          <div className="journey-milestone-card">
            <div>
              <span className="journey-grade-badge flex items-center gap-1.5">
                <TreeGrowthStage grade={12} className="h-4 w-4" />
                <span>Grade 12 · Capstone</span>
              </span>
              <h3 className="journey-card-title">Prestige Awards & University Entrance</h3>
              <p className="journey-card-desc">
                Target major national awards ($100k+ Loran, Schulich Leader, TD Community Leadership) and institutional entrance scholarships. Deadlines arrive early in fall!
              </p>
            </div>
            <div>
              <div className="journey-card-focus">
                <strong>Key Focus:</strong> Fall scholarship deadlines & entrance awards
              </div>
              <a href="/opportunities?grade=12" className="journey-card-link">
                Grade 12 Opportunities <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Student Tools Bento Showcase */}
      <section className="section-wrapper">
        <div className="section-header-row">
          <div>
            <Eyebrow>Integrated Toolkit</Eyebrow>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-strong)]">
              Free Tools to Plan, Track, and Win
            </h2>
          </div>
          <p className="section-header-intro">
            MaplePath provides high-utility planning tools designed specifically for Canadian high-school workflows.
          </p>
        </div>

        <div className="bento-showcase-grid">
          {/* Tool 1: Roadmap (Span 2) */}
          <div className="bento-tool-card bento-card-span-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[var(--spruce-light)]/40 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[var(--spruce-primary)]">
                  Visual Strategy
                </span>
                <span className="text-xs text-[var(--ink-muted)]">Grade-by-Grade Planner</span>
              </div>
              <h3 className="mt-3 font-serif text-2xl font-bold text-[var(--ink-strong)]">
                Interactive High-School Journey Roadmap
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[var(--ink-body)] leading-relaxed max-w-xl">
                Plot your entire secondary school strategy before senior year panic sets in. Group opportunities into Grade 9 through Grade 12 milestones, monitor prerequisite competitions, and balance academic contests with summer internships.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="/roadmap" className="primary-button">
                Open Roadmap Builder ↗
              </a>
              <span className="text-xs text-[var(--ink-muted)]">
                ✓ Interactive milestone preview
              </span>
            </div>
          </div>

          {/* Tool 2: Calendar Export */}
          <div className="bento-tool-card">
            <div>
              <span className="rounded-full bg-[var(--maple-glow)] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[var(--maple-primary)]">
                Never Miss a Date
              </span>
              <h3 className="mt-3 font-serif text-xl font-bold text-[var(--ink-strong)]">
                1-Click Calendar Sync (.ics)
              </h3>
              <p className="mt-2 text-sm text-[var(--ink-body)] leading-relaxed">
                Export saved scholarship and internship deadlines directly to Apple Calendar, Google Calendar, or Outlook with alert reminders.
              </p>
            </div>
            <div className="mt-6">
              <a href="/dashboard" className="text-link">
                Launch via Dashboard →
              </a>
            </div>
          </div>

          {/* Tool 3: Map Explorer */}
          <div className="bento-tool-card">
            <div>
              <span className="rounded-full bg-[var(--surface-sunken)] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                Coast-to-Coast
              </span>
              <h3 className="mt-3 font-serif text-xl font-bold text-[var(--ink-strong)]">
                Geographic Map Explorer
              </h3>
              <p className="mt-2 text-sm text-[var(--ink-body)] leading-relaxed">
                Explore hospital placements, university laboratories, and regional youth councils plotted interactively across Canadian provinces with MapLibre.
              </p>
            </div>
            <div className="mt-6">
              <a href="/opportunities?view=map" className="text-link">
                Launch Canada Map →
              </a>
            </div>
          </div>

          {/* Tool 4: Tracker & Notes (Span 2) */}
          <div className="bento-tool-card bento-card-span-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[var(--spruce-light)]/40 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[var(--spruce-primary)]">
                  Personal Dashboard
                </span>
                <span className="text-xs text-[var(--ink-muted)]">Application Workspace</span>
              </div>
              <h3 className="mt-3 font-serif text-2xl font-bold text-[var(--ink-strong)]">
                Application Status & Private Draft Notes
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[var(--ink-body)] leading-relaxed max-w-xl">
                Track each opportunity through its lifecycle: from Saved to Drafting, Submitted, and Won. Store your private draft ideas, reference letter requests, and submission portal links in one organized student cockpit.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="/dashboard" className="secondary-button">
                Open Student Dashboard ↗
              </a>
              <span className="text-xs text-[var(--ink-muted)]">
                ✓ Full tracking & draft notes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Province & Territory Quick Explorer */}
      <section className="section-wrapper">
        <div className="section-header-row">
          <div>
            <Eyebrow>Regional Directory</Eyebrow>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-strong)]">
              Explore by Province or Territory
            </h2>
          </div>
          <p className="section-header-intro">
            Filter specifically for regional programs or explore nationwide remote opportunities.
          </p>
        </div>

        <div className="province-pill-grid">
          {supportedProvinces.map((prov) => {
            const count = opportunities.filter(
              (o) =>
                o.province === prov ||
                (prov === 'National' && o.locationMode === 'Canada') ||
                (prov === 'Online / worldwide' && o.locationMode === 'Online'),
            ).length;

            const code = provinceCodes[prov] || 'CA';

            return (
              <a
                key={prov}
                href={`/opportunities?province=${encodeURIComponent(prov)}`}
                className="province-pill-item group"
              >
                <span className="rounded bg-[var(--surface-sunken)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--spruce-primary)] group-hover:bg-[var(--maple-primary)] group-hover:text-white transition-colors">
                  {code}
                </span>
                <span>{prov}</span>
                <span className="text-xs text-[var(--ink-muted)] font-medium">
                  ({count})
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* Four Pathways Section */}
      <section className="section-wrapper">
        <div className="section-header-row">
          <div>
            <Eyebrow>Curated Pathways</Eyebrow>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-strong)]">
              Four Avenues for Secondary Students
            </h2>
          </div>
          <p className="section-header-intro">
            Target your specific goal: post-secondary funding, academic prestige, lab experience, or civic leadership.
          </p>
        </div>

        <div className="feature-grid-four">
          <div className="feature-box">
            <span className="feature-box-number">01 / AWARDS</span>
            <h3>Scholarships & Bursaries</h3>
            <p>
              Merit awards, community leadership grants, STEM scholarships, and bursaries open to Canadian secondary school students.
            </p>
            <a className="feature-box-link" href="/opportunities?type=Scholarship">
              Browse scholarships ({scholarshipCount}) <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="feature-box">
            <span className="feature-box-number">02 / CHALLENGES</span>
            <h3>Academic Competitions</h3>
            <p>
              Math olympiads, computing challenges, science fairs, writing contests, and business pitch competitions with national recognition.
            </p>
            <a className="feature-box-link" href="/opportunities?type=Competition">
              Browse competitions ({competitionCount}) <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="feature-box">
            <span className="feature-box-number">03 / EXPERIENCE</span>
            <h3>Internships & Research</h3>
            <p>
              Summer lab placements, hospital internships, university mentorships, and nonprofit fellowships for motivated students.
            </p>
            <a className="feature-box-link" href="/opportunities?type=Internship">
              Browse internships ({internshipCount}) <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="feature-box">
            <span className="feature-box-number">04 / LEADERSHIP</span>
            <h3>Programs & Youth Roles</h3>
            <p>
              Youth government councils, summer leadership academies, civic programs, and community advocate positions.
            </p>
            <a className="feature-box-link" href="/opportunities?type=Program">
              Browse programs ({programCount}) <span aria-hidden="true">↗</span>
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
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-strong)]">
                Notable Upcoming Opportunities
              </h2>
            </div>
            <a className="text-link" href="/opportunities">
              View all {opportunities.length} opportunities <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="opportunities-grid">
            {featuredOpportunities.map((opportunity) => (
              <OpportunityTeaser
                key={opportunity.id}
                opportunity={opportunity}
                initialSaved={savedIds.includes(opportunity.id)}
                isAuthenticated={Boolean(user)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="section-wrapper">
        <div className="section-header-row">
          <div>
            <Eyebrow>Common Questions</Eyebrow>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-strong)]">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="section-header-intro">
            Everything you need to know about MaplePath, eligibility verification, and how to get started.
          </p>
        </div>

        <div className="mt-8 max-w-3xl mx-auto">
          <FaqAccordion />
        </div>
      </section>

      {/* Editorial Verification Guarantee Banner */}
      <section className="guide-banner">
        <div className="guide-banner-card">
          <div>
            <Eyebrow>Verification Guarantee</Eyebrow>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-strong)]">
              Always Verified with Official Host Portals
            </h2>
            <p>
              MaplePath is curated and audited by Canadian students and educators. We never link to essay mills, sweepstakes, or lead-generation portals. Every opportunity links directly to official host institutions.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a className="secondary-button" href="/how-it-works">
                Read our verification standards <span aria-hidden="true">↗</span>
              </a>
              <a className="secondary-button" href="/submit-role">
                Submit an opportunity <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="guide-inner-note">
            <span>Weekly Audit Cycle</span>
            <strong>
              “Every listing is checked for active official links, grade eligibility, and accurate deadline indicators.”
            </strong>
            <p className="mt-2 text-xs text-[var(--ink-muted)]">
              Last catalog audit: {displayDate(catalogUpdatedAt)}
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
