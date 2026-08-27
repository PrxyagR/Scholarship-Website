/* eslint-disable @next/next/no-html-link-for-pages */
import { catalogUpdatedAt } from '../data/opportunities';

export const displayDate = (value: string) =>
  new Intl.DateTimeFormat('en-CA', { month: 'long', day: 'numeric', year: 'numeric' }).format(
    new Date(`${value}T12:00:00`),
  );

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true">✦</span>;
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="MaplePath home">
        <BrandMark />
        <span>MaplePath</span>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="/opportunities">Explore</a>
        <a href="/how-it-works">How it works</a>
        <a href="/about">About</a>
      </nav>
      <a className="header-button" href="/opportunities">
        Browse opportunities <span aria-hidden="true">↘</span>
      </a>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a className="footer-brand" href="/" aria-label="MaplePath home">
        <BrandMark />
        <span>MaplePath</span>
      </a>
      <p>A student-built starting point for bigger possibilities.</p>
      <div className="footer-meta">
        <span>Catalog last reviewed {displayDate(catalogUpdatedAt)}</span>
        <a href="/opportunities">Explore ↗</a>
      </div>
    </footer>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span className="eyebrow-dot" />
      {children}
    </p>
  );
}
