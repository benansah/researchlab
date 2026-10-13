import Image from "next/image";
import Link from "next/link";
import { centreName, institution, navItems, school } from "../lib/site-content";

export default function SiteFooter() {
  return (
    <footer className="bg-forest-deep text-white/80">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
        <div>
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white p-1">
              <Image src="/logo.png" alt="" width={120} height={120} className="h-full w-full object-contain" />
            </span>
            <p className="font-display text-xl font-medium leading-snug text-white">{centreName}</p>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/65">
            Bridging traditional knowledge and modern pharmaceutical science to deliver safe, evidence-based medicines from nature.
          </p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[.09em] text-leaf-light">
            {school} · {institution}
          </p>
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[.09em] text-leaf-light">Explore</h2>
          <ul className="mt-5 space-y-2.5 text-[15px]">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="transition-colors hover:text-white">{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[.09em] text-leaf-light">Contact</h2>
          <address className="mt-5 space-y-2.5 text-[15px] not-italic leading-relaxed">
            <p>{school}<br />{institution}<br />PMB 31, Ho, Volta Region, Ghana</p>
            <p><a href="mailto:cpnpdd@uhas.edu.gh" className="transition-colors hover:text-white">cpnpdd@uhas.edu.gh</a></p>
          </address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-white/50 sm:flex-row sm:justify-between lg:px-10">
          <p>© {new Date().getFullYear()} {centreName}. All rights reserved.</p>
          <Link href="/admin" className="hover:text-white">Staff login</Link>
        </div>
      </div>
    </footer>
  );
}
