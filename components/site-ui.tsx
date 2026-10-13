import Link from "next/link";

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[.09em] ${light ? "text-leaf-light" : "text-leaf-dark"}`}>
      <span aria-hidden className={`h-px w-8 ${light ? "bg-leaf-light" : "bg-leaf"}`} />
      {children}
    </p>
  );
}

export function Arrow() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 10h11m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const focusIcons: Record<string, React.ReactNode> = {
  leaf: <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14m0 0 7-7" />,
  flask: <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3M7.5 15h9" />,
  capsule: <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7ZM8.5 8.5l7 7" />,
  shield: <path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.3 7.5 9.5 4.3-1.2 7.5-5 7.5-9.5V6L12 3Zm-3 9 2 2 4-4" />,
};

export function FocusIcon({ name, className = "h-7 w-7" }: { name: string; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {focusIcons[name]}
    </svg>
  );
}

export const sectionHeading = "font-display text-[clamp(2rem,3.6vw,3rem)] font-medium leading-[1.08] tracking-[-.015em] text-ink";

export function PageHero({ crumbs, eyebrow, title, children }: {
  crumbs: { name: string; href: string }[];
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-forest text-white">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_10%,rgba(63,191,120,.32),transparent_55%),radial-gradient(ellipse_at_0%_100%,rgba(0,0,0,.35),transparent_60%)]" />
      <div aria-hidden className="absolute inset-0 opacity-[.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-10 lg:px-10 lg:pb-24">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[.09em] text-white/60">
            {crumbs.map((crumb, i) => (
              <li key={crumb.href} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden className="text-leaf-light/60">/</span>}
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className="text-white">{crumb.name}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-white">{crumb.name}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-14">
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.6rem,5.4vw,4.4rem)] font-medium leading-[1.03] tracking-[-.02em] text-white">{title}</h1>
          {children}
        </div>
      </div>
    </section>
  );
}
