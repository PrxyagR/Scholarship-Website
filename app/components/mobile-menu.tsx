/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import { useEffect, useRef, useState } from 'react';

const links = [
  { href: '/opportunities', label: 'Explore opportunities', note: 'Search the catalog' },
  { href: '/how-it-works', label: 'How it works', note: 'Find your next step' },
  { href: '/about', label: 'About MaplePath', note: 'Why the directory exists' },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      panelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    if (open) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <div className={`mobile-menu ${open ? 'is-open' : ''}`}>
      <button
        ref={toggleRef}
        className="mobile-menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <span className={`menu-icon ${open ? 'is-open' : ''}`} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {open && (
        <div ref={panelRef} className="mobile-menu-panel" id="mobile-navigation">
          <div className="mobile-menu-heading">
            <span>MaplePath</span>
            <span>Student opportunities</span>
          </div>
          <nav aria-label="Mobile navigation">
            {links.map((link) => (
              <a href={link.href} key={link.href} onClick={closeMenu}>
                <span>{link.label}</span>
                <small>{link.note}</small>
                <strong aria-hidden="true">↗</strong>
              </a>
            ))}
          </nav>
          <a className="mobile-menu-cta" href="/opportunities" onClick={closeMenu}>
            Browse the directory <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}
    </div>
  );
}
