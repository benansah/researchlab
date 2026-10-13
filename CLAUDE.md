@AGENTS.md

# CPNPDD research centre website

Public website and admin CMS for the **Centre for Phytomedicine and Natural Product Drug Discovery (CPNPDD)**, School of Pharmacy, University of Health and Allied Sciences (UHAS), Ho, Ghana. Built with Next.js 16 (App Router, React 19), Tailwind CSS 4 and Supabase (Postgres + auth).

## Commands

- `npm run dev` / `npm run build` / `npm run lint`
- Type check: `npx next typegen` then `npx tsc --noEmit`. Run typegen after adding or removing routes, or `PageProps<"/route">` types fail. If tsc complains about a deleted route in `.next/dev/types`, delete that folder (left behind by an old dev server).
- Smoke test: `npx next build`, then `npx next start -p 3456` and request each page.

## Environment notes (Windows)

- The Bash tool lacks `git`, `ls` and `find`; use PowerShell for shell commands.
- Some files use CRLF line endings, so PowerShell `.Replace()` on multi-line strings silently misses. Prefer the Edit tool.
- Write multi-line commit messages to a file in the scratchpad and run `git commit -F <file>` (PowerShell here-strings piped to `-F -` fail).

## Architecture

- `lib/supabase/{server,client}.ts`: Supabase clients. `proxy.ts` (Next 16's replacement for middleware) refreshes the Supabase session and sends `/admin/*` to the login page when Supabase isn't configured or no one is signed in.
- `lib/*.ts`: data access, one module per content type.
  - `labs.ts`: labs and lab members. It also exports `isMissingTable()`.
  - `garden.ts`: physic garden plants.
  - `publications.ts`: publications.
  - `news.ts`: news and events.
- `lib/site-content.ts`: static copy, including nav items, contact email and address, the four focus areas (each with an `id` that `/research#<id>` links to), services and audiences.
- `components/`:
  - `site-header` and `navbar`: the Labs dropdown is filled from the database.
  - `site-footer`
  - `ui.tsx`: `Eyebrow`, `Arrow`, `PageHero`, `FocusIcon`, `sectionHeading`.
  - `publication-list`, `news-list`, `plant-catalogue`, `plant-card`, `avatar`, `lab-mark`, `botanical-line-art`.
- Design tokens are in `app/globals.css` under `@theme`: forest, forest-deep, leaf, leaf-light, leaf-dark, cream, line, ink, moss. Fonts are Inter (sans) and Newsreader (`font-display`). Admin styles are plain CSS classes (`.admin-*`) in the same file.

### Public routes

| Route | Content |
| --- | --- |
| `/` | Home page. Stats are counted from live data, plus featured publications and news. |
| `/about`, `/services`, `/contact` | Mostly static copy from `site-content.ts`. |
| `/research` | Focus areas, labs, and all publications. `?topic=` filters publications by tag. |
| `/labs`, `/labs/[slug]` | Lab profiles, including each lab's publications. |
| `/physicgarden`, `/physicgarden/[slug]` | Plant catalogue and plant detail pages. |
| `/news`, `/news/[slug]` | News and events, with upcoming events listed first. |
| `/search?q=` | Searches labs, people, publications, plants, news, focus areas and services. Every query word must match. |

### Admin (`/admin`, Supabase email/password login; users are created in the Supabase dashboard)

- Sections: `/admin/lab-profiles`, `/admin/garden`, `/admin/publications`, `/admin/news`. Each has a list page with a create form, an `[id]` edit page, and server actions in `actions.ts`.
- Every page and action calls `requireAdmin()` from `admin-page-shell.tsx`.
- Actions redirect back with `?saved=<key>` or `?error=<msg>`. The message for each `saved` key is defined in `app/admin/notice.tsx`.
- After writes, actions call `revalidatePath("/", "layout")`.
- New records are created as drafts (`published: false`).
- List fields such as aims and traditional uses are edited in textareas, one item per line.

## Conventions

- **Database:** SQL migrations live in `supabase/migrations/000N_*.sql`. They are run manually in the Supabase SQL Editor and must be safe to re-run (`if not exists`, `drop policy if exists`, seed rows guarded by `where not exists`).
- **Access rules:** the public can read rows where `published`. Authenticated users can do everything.
- **Fallback content:** each `lib` getter falls back to hard-coded content that mirrors the migration's seed rows when `isMissingTable(error)` is true, so the site still works before migrations have run. When a query embeds another table (e.g. `lab:labs(slug, name)`), a missing table reports as `PGRST200`, not `PGRST205`.
- **Error handling:** the header and home-page sections catch data errors (`.catch(() => [])`) and hide themselves rather than crash the page.
- **Tailwind classes:** never build class names dynamically. Use static lookup maps instead (see `statColumns` / `factColumns`).
- **Imports:** use relative imports (no `@/` alias in use). Match the existing dense JSX style.
- **Adding a content type:** add a migration, a `lib/<type>.ts` getter with fallback data, admin list, edit and actions files following `admin/publications`, the notice messages, the subnav link in `admin-page-shell.tsx`, a dashboard card in `admin/page.tsx`, and search coverage in `app/search/page.tsx`.

## Status (update this section as work progresses)

Last updated 2026-10-13. Work is on the `site-buildout` branch, which is not pushed (remote: github.com/benansah/researchlab).

Done: labs, physic garden, publications, news and events, search, about, services and contact, the redesigned home page, and admin CRUD for all four content types.

Outstanding (mostly on the owner's side):
- [x] All migrations 0001–0004 have been run in Supabase (0004 on 2026-10-13; seed publications and news are live).
  - The live project had an older, empty `publications` table. 0004 upgrades it in place, which was tested in PGlite against fresh, empty and populated old tables.
- [ ] There is an unused old `news` table. The site uses `news_posts`. `news` can be dropped once confirmed empty.
- [ ] Replace the placeholder content via `/admin`: lab leads ("Dr. Harley" etc.), "Student Name" members, the 4 seed publications and the 3 news posts.
- [ ] Confirm the contact email. `cpnpdd@uhas.edu.gh` is used everywhere; the old contact page used `researchlab@uhas.edu.gh`.
- [ ] Confirm the services list and the About mission and values copy in `site-content.ts` and `app/about/page.tsx`.
- [ ] Admin publication and news pages have not been click-tested while signed in.
- [ ] Merge or push `site-buildout` when ready.
