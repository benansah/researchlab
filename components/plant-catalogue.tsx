"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { GardenPlant } from "../lib/garden";
import PlantCard from "./plant-card";

const SAVED_KEY = "physic-garden:saved";

const SAVED_EVENT = "physic-garden:saved-change";

// Saved plants live in localStorage so they survive reloads; storage can be unavailable, so fail soft.
function readSavedRaw() {
  try {
    return window.localStorage.getItem(SAVED_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function subscribeSaved(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(SAVED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SAVED_EVENT, onChange);
  };
}

function parseSaved(raw: string): string[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

const selectClass =
  "h-11 appearance-none rounded-full bg-white bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='%230e1f17' stroke-width='1.6'%3E%3Cpath d='m3 4.5 3 3 3-3'/%3E%3C/svg%3E\")] bg-[length:12px] bg-[right_14px_center] bg-no-repeat pl-4 pr-9 text-sm text-ink ring-1 ring-line outline-none focus:ring-2 focus:ring-leaf";

export default function PlantCatalogue({ plants }: { plants: GardenPlant[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [family, setFamily] = useState("");
  const [researchOnly, setResearchOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const savedRaw = useSyncExternalStore(subscribeSaved, readSavedRaw, () => "[]");
  const saved = useMemo(() => parseSaved(savedRaw), [savedRaw]);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpen) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !filterRef.current?.contains(event.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [filterOpen]);

  function toggleSaved(slug: string) {
    const next = saved.includes(slug) ? saved.filter((s) => s !== slug) : [...saved, slug];
    try {
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(SAVED_EVENT));
    } catch {
      // Saving is a convenience; ignore storage being unavailable.
    }
  }

  const categories = useMemo(() => [...new Set(plants.map((p) => p.category).filter(Boolean))].sort(), [plants]);
  const families = useMemo(() => [...new Set(plants.map((p) => p.family).filter(Boolean))].sort(), [plants]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return plants.filter((plant) => {
      if (category && plant.category !== category) return false;
      if (family && plant.family !== family) return false;
      if (researchOnly && !plant.lab && !plant.research_notes) return false;
      if (savedOnly && !saved.includes(plant.slug)) return false;
      if (!q) return true;
      return [plant.botanical_name, plant.common_name, plant.local_names, plant.family, ...plant.traditional_uses, ...plant.parts_used]
        .some((field) => field.toLowerCase().includes(q));
    });
  }, [plants, query, category, family, researchOnly, savedOnly, saved]);

  const extraFilters = Number(researchOnly) + Number(savedOnly);
  const anyFilter = query || category || family || extraFilters > 0;

  function clearAll() {
    setQuery("");
    setCategory("");
    setFamily("");
    setResearchOnly(false);
    setSavedOnly(false);
  }

  return (
    <div>
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-xl xl:max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-leaf-dark">Explore our</p>
          <h2 className="mt-2 font-display text-[clamp(2.4rem,4vw,3.25rem)] leading-[1.05] tracking-[-.02em] text-ink">Plant Collection</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-moss">
            Browse our collection of medicinal and aromatic plants, with their traditional uses, botanical classification and research interest.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:flex-nowrap">
          <label className="relative block w-full sm:w-72 xl:w-64">
            <span className="sr-only">Search plants</span>
            <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-moss" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search plants or uses…"
              className="h-11 w-full rounded-full bg-white pl-11 pr-4 text-sm text-ink outline-none ring-1 ring-line placeholder:text-moss/70 focus:ring-2 focus:ring-leaf"
            />
          </label>
          <select aria-label="Category" value={category} onChange={(event) => setCategory(event.target.value)} className={selectClass}>
            <option value="">All categories</option>
            {categories.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
          <select aria-label="Plant family" value={family} onChange={(event) => setFamily(event.target.value)} className={selectClass}>
            <option value="">All families</option>
            {families.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>

          <div ref={filterRef} className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen((open) => !open)}
              aria-expanded={filterOpen}
              aria-haspopup="true"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-white transition-colors hover:bg-leaf-dark"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                <path d="M4 5h16l-6 7.5V19l-4 1.5v-8L4 5Z" />
              </svg>
              Filter
              {extraFilters > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs text-forest">{extraFilters}</span>}
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-2xl bg-white p-2 shadow-[0_20px_40px_-12px_rgba(6,48,31,.35)] ring-1 ring-line">
                {[
                  { label: "Under active research", checked: researchOnly, set: setResearchOnly },
                  { label: `Saved plants (${saved.length})`, checked: savedOnly, set: setSavedOnly },
                ].map((option) => (
                  <label key={option.label} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-cream">
                    <input type="checkbox" checked={option.checked} onChange={(event) => option.set(event.target.checked)} className="h-4 w-4 accent-forest" />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 text-sm text-moss">
        <p aria-live="polite">
          Showing {visible.length} of {plants.length} {plants.length === 1 ? "plant" : "plants"}
        </p>
        {anyFilter && (
          <button type="button" onClick={clearAll} className="font-semibold text-leaf-dark hover:text-forest">Clear filters</button>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="mt-5 rounded-2xl bg-cream px-8 py-16 text-center">
          <p className="font-display text-2xl text-ink">No plants match those filters.</p>
          <button type="button" onClick={clearAll} className="mt-4 text-sm font-semibold text-leaf-dark hover:text-forest">Clear filters</button>
        </div>
      ) : (
        <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((plant, i) => (
            <li key={plant.id}>
              <PlantCard plant={plant} index={i} saved={saved.includes(plant.slug)} onToggleSave={() => toggleSaved(plant.slug)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
