/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */
import { catalogUpdatedAt } from '../data/opportunities';
import { MobileMenu } from './mobile-menu';

export const displayDate = (value: string) =>
  new Intl.DateTimeFormat('en-CA', { month: 'long', day: 'numeric', year: 'numeric' }).format(
    new Date(`${value}T12:00:00`),
  );

function BrandMark() {
  return <img className="brand-mark" src="/maplepath-logo.png" width={36} height={36} alt="" />;
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
      <MobileMenu />
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
