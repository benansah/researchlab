"use client";

import { useEffect, useState } from "react";

// Opens the device's share sheet where available (mostly phones); otherwise copies the link.
export default function ShareButton({ path, title, text, className = "" }: { path: string; title: string; text?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function share() {
    const url = new URL(path, window.location.origin).toString();
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        // The visitor closed the share sheet; nothing to do.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt("Copy this link to share it:", url);
    }
  }

  return (
    <button type="button" onClick={share} aria-label={`Share ${title}`} title={`Share ${title}`} className={`relative ${className}`}>
      <svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
      </svg>
      <span
        role="status"
        className={`pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white shadow-sm transition-opacity ${copied ? "opacity-100" : "opacity-0"}`}
      >
        {copied ? "Link copied" : ""}
      </span>
    </button>
  );
}
