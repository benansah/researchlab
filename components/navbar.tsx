"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { auxLinks, centreName, institution, navItems as baseNavItems, school, type NavChild } from "../lib/site-content";

function SearchIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function Chevron({ className = "group-hover:rotate-180" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 12 12" className={`h-2.5 w-2.5 transition-transform duration-200 ${className}`} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
    </svg>
  );
}

export default function Navbar({ labLinks = [] }: { labLinks?: NavChild[] }) {
  const pathname = usePathname();
  const navItems = baseNavItems.map((item) =>
    item.href === "/labs" && labLinks.length ? { ...item, children: [{ name: "All Labs", href: "/labs" }, ...labLinks] } : item,
  );
  const [compact, setCompact] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]) && !href.startsWith("/#"));

  return (
    <header className="sticky top-0 z-50">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:text-forest">
        Skip to main content
      </a>

      <nav
        aria-label="Main site navigation"
        className={`flex bg-white shadow-[0_1px_0_#dcded6,0_8px_24px_-12px_rgba(6,48,31,.25)] transition-[height] duration-300 ease-out ${
          compact ? "h-16 lg:h-[92px]" : "h-16 lg:h-[124px]"
        }`}
      >
        {/* Logo block */}
        <Link
          href="/"
          aria-label="Centre home"
          className={`relative z-10 flex shrink-0 items-center justify-center bg-forest transition-[width] duration-300 ease-out ${
            compact ? "w-16 lg:w-[92px]" : "w-16 lg:w-[124px]"
          }`}
        >
          <span className="flex h-[78%] w-[78%] items-center justify-center rounded-full bg-white p-[3px] ring-2 ring-leaf/60">
            <Image src="/logo.png" alt="" width={240} height={240} priority className="h-full w-full object-contain" />
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top row: site name + aux links */}
          <div className="flex min-h-0 flex-1 items-center justify-between gap-6 px-4 lg:px-7">
            <div className="min-w-0">
              <p
                className={`hidden text-[11px] font-semibold uppercase tracking-[.1em] text-moss transition-all duration-300 lg:block ${
                  compact ? "mb-0 h-0 overflow-hidden opacity-0" : "mb-1 opacity-100"
                }`}
              >
                {institution} <span className="text-leaf">/</span> {school}
              </p>
              <Link
                href="/"
                className={`block truncate font-display font-medium leading-[1.1] text-ink transition-all duration-300 hover:text-forest ${
                  compact ? "text-[15px] lg:text-[22px]" : "text-[15px] lg:text-[28px]"
                }`}
              >
                {centreName}
              </Link>
            </div>

            <ul className="hidden shrink-0 items-center gap-1 xl:flex">
              {auxLinks.map((link, i) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={
                      i === auxLinks.length - 1
                        ? "ml-2 inline-block bg-forest px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-leaf-dark"
                        : "px-3 py-2 text-sm font-semibold text-moss transition-colors hover:text-forest"
                    }
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="flex shrink-0 flex-col items-center gap-0.5 text-forest lg:hidden"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
              <span className="text-[11px] font-medium">Menu</span>
            </button>
          </div>

          {/* Bottom band: main menu + search */}
          <div className="relative hidden h-[38%] items-stretch justify-between bg-cream pl-4 pr-0 shadow-[inset_0_1px_0_#e2e3db] lg:flex">
            <ul className="flex items-stretch">
              {navItems.map((item) => (
                <li key={item.name} className="group relative flex items-stretch">
                  <Link
                    href={item.href}
                    aria-haspopup={item.children ? "true" : undefined}
                    className={`flex items-center gap-1.5 px-3 text-[15px] font-medium text-ink transition-colors hover:text-leaf-dark group-focus-within:text-leaf-dark xl:px-4 ${
                      isActive(item.href) ? "shadow-[inset_0_-3px_0_var(--color-leaf)]" : ""
                    }`}
                  >
                    {item.name}
                    {item.children && <Chevron />}
                  </Link>
                  {item.children && (
                    <ul className="invisible absolute left-0 top-full min-w-60 translate-y-1 border border-line bg-white py-2 opacity-0 shadow-[0_18px_40px_-16px_rgba(6,48,31,.35)] transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <li aria-hidden className="absolute -top-px left-0 h-[3px] w-full bg-leaf" />
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <Link
                            href={child.href}
                            className="block border-l-[3px] border-transparent px-5 py-2.5 text-[15px] text-ink transition-colors hover:border-leaf hover:bg-cream hover:text-forest focus:border-leaf focus:bg-cream focus:outline-none"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
              className="flex aspect-square h-full items-center justify-center bg-forest text-white transition-colors hover:bg-leaf-dark"
            >
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </button>

            <form
              action="/research"
              role="search"
              className={`absolute right-0 top-full flex w-full max-w-xl origin-top-right border-t-[3px] border-leaf bg-white p-3 shadow-[0_18px_40px_-16px_rgba(6,48,31,.35)] transition-all duration-200 ${
                searchOpen ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
              }`}
            >
              <label htmlFor="site-search" className="sr-only">Search the site</label>
              <input
                ref={searchInput}
                id="site-search"
                name="q"
                placeholder="Search research, people, publications…"
                className="min-w-0 flex-1 bg-cream px-4 py-3 text-[15px] text-ink outline-none placeholder:text-moss/70 focus:ring-2 focus:ring-leaf"
              />
              <button type="submit" className="bg-forest px-5 text-sm font-semibold text-white hover:bg-leaf-dark">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Mobile off-canvas menu */}
      <div className={`fixed inset-0 z-[70] lg:hidden ${menuOpen ? "visible" : "invisible"}`}>
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-ink/50 backdrop-blur-[2px] transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          id="mobile-nav"
          aria-label="Mobile navigation"
          className={`absolute right-0 top-0 flex h-full w-[min(88vw,380px)] flex-col overflow-y-auto bg-white transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between bg-forest px-5 py-4 text-white">
            <span className="text-xs font-semibold uppercase tracking-[.09em]">Menu</span>
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="p-1">
              <CloseIcon />
            </button>
          </div>
          <form action="/research" role="search" className="flex border-b border-line bg-cream p-4">
            <label htmlFor="mobile-search" className="sr-only">Search the site</label>
            <input id="mobile-search" name="q" placeholder="Search…" className="min-w-0 flex-1 bg-white px-3 py-2.5 text-[15px] outline-none focus:ring-2 focus:ring-leaf" />
            <button type="submit" aria-label="Search" className="bg-forest px-3.5 text-white"><SearchIcon /></button>
          </form>
          <ul className="flex-1 py-2">
            {navItems.map((item) =>
              item.children ? (
                <li key={item.name} className="border-b border-line/70">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3.5 text-base font-medium text-ink">
                      {item.name}
                      <span className="text-leaf-dark"><Chevron className="h-3.5 w-3.5 group-open:rotate-180" /></span>
                    </summary>
                    <ul className="bg-cream pb-2">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <Link href={child.href} onClick={() => setMenuOpen(false)} className="block px-8 py-2.5 text-[15px] text-ink hover:text-forest">
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={item.name} className="border-b border-line/70">
                  <Link href={item.href} onClick={() => setMenuOpen(false)} className="block px-5 py-3.5 text-base font-medium text-ink">
                    {item.name}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <div className="space-y-2 p-5">
            {auxLinks.map((link) => (
              <Link key={link.name} href={link.href} className="block border border-forest px-4 py-2.5 text-center text-sm font-semibold text-forest">
                {link.name}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </header>
  );
}
