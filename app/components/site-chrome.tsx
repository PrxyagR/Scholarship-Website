/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */
import { catalogUpdatedAt } from '../data/opportunities';
import { FloatingDock } from './floating-dock';
import { MobileMenu } from './mobile-menu';
import { MapleLeafIcon, TreelineSilhouette } from './brand-motif';
import { createClient } from '@/lib/supabase/server';

export const displayDate = (value: string) =>
  new Intl.DateTimeFormat('en-CA', { month: 'long', day: 'numeric', year: 'numeric' }).format(
    new Date(`${value}T12:00:00`),
  );

function BrandMark() {
  return (
    <img
      className="brand-mark transition-transform duration-200 hover:scale-105"
      src="/maplepath-logo.png"
      width={32}
      height={32}
      alt="MaplePath logo"
      loading="eager"
    />
  );
}

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const isAuthenticated = Boolean(user);

  return (
    <>
      <header className="site-header">
        <a className="brand group" href="/" aria-label="MaplePath home">
          <BrandMark />
          <span>MaplePath</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="/opportunities">Explore catalog</a>
          <a href="/dashboard">My dashboard</a>
          <a href="/roadmap">Roadmap</a>
          <a href="/saved">Saved</a>
          <a href="/how-it-works">How it works</a>
          <a href="/about">About</a>
        </nav>
        <a className="header-auth-link" href={isAuthenticated ? '/account' : '/sign-in'}>
          {isAuthenticated ? 'Account' : 'Sign in'}
        </a>
        <a className="header-button" href="/opportunities">
          Browse catalog <span aria-hidden="true">↗</span>
        </a>
        <MobileMenu isAuthenticated={isAuthenticated} />
      </header>
      <FloatingDock isAuthenticated={isAuthenticated} />
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer relative overflow-hidden">
      {/* Forest Treeline Silhouette Transition at Top of Footer */}
      <TreelineSilhouette className="w-full h-7 text-[#0a231d] -mt-1 mb-6 opacity-35" />

      <div className="footer-top-row">
        <a className="footer-brand" href="/" aria-label="MaplePath home">
          <BrandMark />
          <span>MaplePath</span>
        </a>
        <p className="footer-tagline">
          Canada’s free student opportunity directory for Grades 9–12 · From coast to coast to coast 🍁
        </p>
      </div>
      <div className="footer-bottom-row">
        <span className="flex items-center gap-1.5">
          <MapleLeafIcon className="h-3.5 w-3.5 text-[var(--maple-border)] inline shrink-0" />
          <span>Catalog verified {displayDate(catalogUpdatedAt)} · Hand-reviewed weekly</span>
        </span>
        <div className="footer-links">
          <a href="/opportunities">Directory</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/roadmap">Roadmap</a>
          <a href="/saved">Saved</a>
          <a href="/how-it-works">How it works</a>
          <a href="/about">About</a>
          <a href="/privacy">Privacy</a>
        </div>
      </div>
    </footer>
  );
}

export function Eyebrow({
  children,
  icon = true,
}: {
  children: React.ReactNode;
  icon?: boolean;
}) {
  return (
    <p className="eyebrow flex items-center gap-1.5">
      {icon ? (
        <MapleLeafIcon className="h-3 w-3 text-[var(--maple-primary)] shrink-0" />
      ) : (
        <span className="eyebrow-dot" aria-hidden="true" />
      )}
      <span>{children}</span>
    </p>
  );
}
