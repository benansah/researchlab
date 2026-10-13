import Link from "next/link";
import type { Publication } from "../lib/publications";

export default function PublicationList({ publications, showLab = false }: { publications: Publication[]; showLab?: boolean }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {publications.map((pub, i) => {
        const links = [
          { label: "DOI", href: pub.doi_url },
          { label: "PDF", href: pub.pdf_url },
        ].filter((link) => link.href);
        return (
          <li key={pub.id} className="group grid gap-x-6 gap-y-3 py-7 sm:grid-cols-[auto_1fr_auto]">
            <span className="font-display text-3xl font-medium text-leaf">{String(i + 1).padStart(2, "0")}</span>
            <div className="min-w-0">
              {pub.tag && (
                <span className="inline-block bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-[.09em] text-leaf-dark ring-1 ring-line">
                  {pub.tag}
                </span>
              )}
              <h3 className="mt-3 font-display text-xl font-medium leading-snug text-ink transition-colors group-hover:text-forest">{pub.title}</h3>
              <p className="mt-2 text-sm text-moss">
                {[pub.authors, pub.venue && <em key="venue">{pub.venue}</em>, pub.year].filter(Boolean).flatMap((part, j) => (j > 0 ? [" · ", part] : [part]))}
              </p>
              {showLab && pub.lab && (
                <p className="mt-2 text-sm">
                  <Link href={`/labs/${pub.lab.slug}`} className="font-medium text-leaf-dark underline decoration-leaf/40 underline-offset-4 hover:text-forest">{pub.lab.name}</Link>
                </p>
              )}
              {pub.abstract && (
                <details className="group/abstract mt-3">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-forest hover:text-leaf-dark">
                    Abstract <span aria-hidden className="inline-block transition-transform group-open/abstract:rotate-180">▾</span>
                  </summary>
                  <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-ink/80">{pub.abstract}</p>
                </details>
              )}
            </div>
            {links.length > 0 && (
              <div className="flex items-start gap-2 sm:pt-9">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-line bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[.09em] text-forest transition-colors hover:border-forest hover:bg-forest hover:text-white"
                  >
                    {link.label}<span className="sr-only"> for {pub.title} (opens in a new tab)</span>
                  </a>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
