/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */
import { catalogUpdatedAt } from '../data/opportunities';
import { MobileMenu } from './mobile-menu';

export const displayDate = (value: string) =>
  new Intl.DateTimeFormat('en-CA', { month: 'long', day: 'numeric', year: 'numeric' }).format(
    new Date(`${value}T12:00:00`),
  );

function BrandMark() {
  return (
    <img
      className="brand-mark"
      src="/maplepath-logo.png"
      width={32}
      height={32}
      alt="MaplePath logo"
      loading="eager"
    />
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="MaplePath home">
        <BrandMark />
        <span>MaplePath</span>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="/opportunities">Explore catalog</a>
        <a href="/how-it-works">How it works</a>
        <a href="/about">About</a>
      </nav>
      <a className="header-auth-link" href="/sign-in">
        Sign in
      </a>
      <a className="header-button" href="/opportunities">
        Browse catalog <span aria-hidden="true">↗</span>
      </a>
      <MobileMenu />
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top-row">
        <a className="footer-brand" href="/" aria-label="MaplePath home">
          <BrandMark />
          <span>MaplePath</span>
        </a>
        <p className="footer-tagline">
          Canada’s free student opportunity directory for Grades 9–12.
        </p>
      </div>
      <div className="footer-bottom-row">
        <span>Catalog verified {displayDate(catalogUpdatedAt)} · Hand-reviewed weekly</span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="/opportunities">Directory</a>
          <a href="/how-it-works">How it works</a>
          <a href="/about">About</a>
          <a href="/privacy">Privacy</a>
        </div>
      </div>
    </footer>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span className="eyebrow-dot" aria-hidden="true" />
      {children}
    </p>
  );
}
