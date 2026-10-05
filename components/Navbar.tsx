"use client";

import { useState } from "react";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-content items-center justify-between px-6 py-4 lg:px-10"
      >
        <a href="#top" className="flex items-center gap-2.5">
          <Logo className="h-8 w-8" />
          <span className="font-display text-lg font-medium text-ink">
            MockAI
          </span>
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[15px] text-ink-soft transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            className="rounded-full px-4 py-2 text-[15px] font-medium text-ink-soft transition-colors hover:text-ink"
          >
            Log in
          </button>
          <button
            type="button"
            className="rounded-full bg-navy px-5 py-2.5 text-[15px] font-medium text-paper shadow-card transition-all hover:bg-navy-deep hover:shadow-lifted"
          >
            Get Started
          </button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            {menuOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <>
                <path d="M4 7h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M4 12h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-line bg-paper px-6 pb-6 pt-2 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-[15px] text-ink-soft transition-colors hover:bg-line/40 hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2.5 border-t border-line pt-4">
            <button
              type="button"
              className="rounded-full border border-line px-4 py-2.5 text-[15px] font-medium text-ink transition-colors hover:bg-line/30"
            >
              Log in
            </button>
            <button
              type="button"
              className="rounded-full bg-navy px-4 py-2.5 text-[15px] font-medium text-paper shadow-card transition-colors hover:bg-navy-deep"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
