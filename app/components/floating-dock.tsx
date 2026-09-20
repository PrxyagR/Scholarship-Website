'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MapleLeafIcon } from './brand-motif';

interface FloatingDockProps {
  isAuthenticated?: boolean;
}

/**
 * Mobile-only bottom tab bar for quick thumb-reach navigation on phones.
 * On desktop (screens >= 768px), navigation is exclusively handled by the primary top SiteHeader.
 */
export function FloatingDock({}: FloatingDockProps) {
  const pathname = usePathname();

  const mobileItems = [
    {
      href: '/',
      label: 'Home',
      icon: <MapleLeafIcon className="h-5 w-5" />,
      active: pathname === '/',
    },
    {
      href: '/opportunities',
      label: 'Explore',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      active: pathname.startsWith('/opportunities'),
    },
    {
      href: '/roadmap',
      label: 'Roadmap',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
      active: pathname === '/roadmap',
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      ),
      active: pathname === '/dashboard',
    },
    {
      href: '/saved',
      label: 'Saved',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ),
      active: pathname === '/saved',
    },
  ];

  return (
    <nav
      aria-label="Mobile navigation bar"
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around border-t border-[var(--border-subtle)] bg-white/95 px-2 py-1.5 backdrop-blur-lg"
      style={{
        paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {mobileItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-1 flex-col items-center justify-center py-1 text-center transition-colors ${
            item.active
              ? 'text-[var(--maple-primary)] font-semibold'
              : 'text-[var(--ink-muted)] hover:text-[var(--ink-strong)]'
          }`}
        >
          <div className="relative">
            {item.icon}
            {item.active && (
              <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[var(--maple-primary)]" />
            )}
          </div>
          <span className="mt-0.5 text-[10px] tracking-tight">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
