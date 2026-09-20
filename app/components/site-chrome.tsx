/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */
import { catalogUpdatedAt } from '../data/opportunities';
import { MobileMenu } from './mobile-menu';
import { createClient } from '@/lib/supabase/server';

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

type ToolbarIconName = 'home' | 'explore' | 'saved' | 'account';

function ToolbarIcon({ name }: { name: ToolbarIconName }) {
  const commonProps = {
    className: 'mobile-bottom-toolbar-icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (name === 'home') {
    return (
      <svg {...commonProps}>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </svg>
    );
  }

  if (name === 'explore') {
    return (
      <svg {...commonProps}>
        <circle cx="10.8" cy="10.8" r="6.3" />
        <path d="m16 16 4.5 4.5" />
        <path d="m8.8 12.8 1.5-3.2 3.2-1.5-1.5 3.2-3.2 1.5Z" />
      </svg>
    );
  }

  if (name === 'saved') {
    return (
      <svg {...commonProps}>
        <path d="M20.8 8.7c0 5.2-8.8 10.6-8.8 10.6S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.2 20a6.8 6.8 0 0 1 13.6 0" />
    </svg>
  );
}

export function MobileBottomToolbar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const links: Array<{ href: string; label: string; icon: ToolbarIconName }> = [
    { href: '/', label: 'Home', icon: 'home' },
    { href: '/opportunities', label: 'Explore', icon: 'explore' },
    { href: '/saved', label: 'Saved', icon: 'saved' },
    {
      href: isAuthenticated ? '/account' : '/sign-in',
      label: isAuthenticated ? 'Account' : 'Sign in',
      icon: 'account',
    },
  ];

  return (
    <nav className="mobile-bottom-toolbar" aria-label="Mobile primary navigation">
      {links.map((link) => (
        <a key={link.href} href={link.href} className="mobile-bottom-toolbar-link">
          <ToolbarIcon name={link.icon} />
          <span>{link.label}</span>
        </a>
      ))}
    </nav>
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
        <a className="brand" href="/" aria-label="MaplePath home">
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
      <MobileBottomToolbar isAuthenticated={isAuthenticated} />
    </>
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

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span className="eyebrow-dot" aria-hidden="true" />
      {children}
    </p>
  );
}
