/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import { useEffect, useRef, useState } from 'react';

const mainLinks = [
  {
    href: '/opportunities',
    title: 'Explore opportunities',
    subtitle: 'Search scholarships, competitions & internships',
  },
  {
    href: '/how-it-works',
    title: 'How it works',
    subtitle: 'Guide to eligibility, deadlines & official sources',
  },
  {
    href: '/saved',
    title: 'Saved opportunities',
    subtitle: 'Keep a shortlist for later',
  },
  {
    href: '/about',
    title: 'About MaplePath',
    subtitle: 'Our story, editorial standards & weekly reviews',
  },
  {
    href: '/sign-in',
    title: 'Sign in / account',
    subtitle: 'Access your MaplePath account',
  },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      const firstLink = drawerRef.current?.querySelector<HTMLAnchorElement>('a');
      firstLink?.focus();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <div className="mobile-menu-wrapper">
      <button
        ref={toggleRef}
        className="mobile-menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation-drawer"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={`hamburger-icon ${open ? 'is-open' : ''}`} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {open && (
        <>
          <div
            className="mobile-menu-backdrop"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div
            ref={drawerRef}
            id="mobile-navigation-drawer"
            className="mobile-menu-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <nav className="mobile-menu-links" aria-label="Mobile menu navigation">
              {mainLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={closeMenu}
                >
                  <div>
                    <span className="mobile-nav-title">{link.title}</span>
                    <span className="mobile-nav-subtitle">{link.subtitle}</span>
                  </div>
                  <span className="mobile-nav-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ))}
            </nav>

            <div className="mobile-quick-filters">
              <span className="mobile-quick-filters-label">Quick Jump to Catalog</span>
              <div className="mobile-quick-pills">
                <a
                  href="/opportunities"
                  className="mobile-quick-pill"
                  onClick={closeMenu}
                >
                  Scholarships
                </a>
                <a
                  href="/opportunities"
                  className="mobile-quick-pill"
                  onClick={closeMenu}
                >
                  Competitions
                </a>
                <a
                  href="/opportunities"
                  className="mobile-quick-pill"
                  onClick={closeMenu}
                >
                  Internships
                </a>
                <a
                  href="/opportunities"
                  className="mobile-quick-pill"
                  onClick={closeMenu}
                >
                  Grades 9–12
                </a>
              </div>
            </div>

            <a
              href="/opportunities"
              className="mobile-menu-cta"
              onClick={closeMenu}
            >
              Browse all opportunities <span aria-hidden="true">↗</span>
            </a>
          </div>
        </>
      )}
    </div>
  );
}
