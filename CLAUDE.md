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
  - `site-ui.tsx`: `Eyebrow`, `Arrow`, `PageHero`, `FocusIcon`, `sectionHeading` (public site only).
  - `publication-list`, `news-list`, `plant-catalogue`, `plant-card`, `avatar`, `lab-mark`, `botanical-line-art`.
  - `components/ui/`: shadcn/ui components (Radix base, "nova" preset, Lucide icons), used by the admin only. Add more with `npx shadcn@latest add <name>`. `hooks/use-mobile.ts` was rewritten with `useSyncExternalStore` to pass lint. Don't let `shadcn add --overwrite` replace it.
- **Public styling:** design tokens are in `app/globals.css` under `@theme`: forest, forest-deep, leaf, leaf-light, leaf-dark, cream, line, ink, moss. Fonts are Inter (sans) and Newsreader (`font-display`).
- **Admin styling:** the shadcn theme variables are in `:root` at the bottom of `globals.css`. `--primary` is tinted forest green. The base layer sets every heading in the display serif, so a rule there switches headings back to the sans inside `.admin-ui` and dialogs. The admin uses Inter too: shadcn's init swaps the site font to Geist, so revert `layout.tsx` if you ever re-run it.

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

- **Layout:** pages live in the `app/admin/(dashboard)/` route group, which doesn't change URLs. Its `layout.tsx` provides the shadcn sidebar, the toaster and `Flash`. `/admin/login` sits outside the group, so it has no sidebar.
- **Sections:** `/admin` (overview: counts, "needs attention", recently updated), `/admin/news`, `/admin/publications`, `/admin/lab-profiles`, `/admin/garden`. Each section has:
  - a list page: table, search (`?q=`), status tabs (`?status=published|draft`), and a "New…" dialog;
  - an `[id]` edit page;
  - server actions in `actions.ts`.
- **Shared admin pieces** (in `app/admin/_components/`):
  - `app-sidebar`: the sidebar nav.
  - `page-header`: breadcrumbs, title and actions.
  - `editor`: `EditorForm`, `Section`, `Row`, the `*Field` inputs and `PublishPanel` (status, publish switch, save, view, delete).
  - `form-controls`: `SubmitButton`, `ConfirmDelete`, `FormDialog`.
  - `list`: `ListToolbar`, `filterRows`, `StatusBadge`, `EmptyState`, `LoadError`, `timeAgo`.
  - `flash`.
- **Forms:** use plain `<form action={serverAction}>`, with no client state. Booleans use shadcn `Switch` with `name`, which posts `"on"` when checked. Selects use `NativeSelect`, because a real `<select>` posts reliably and allows `""` for "none". Delete and create forms live inside dialogs that portal to `<body>`, so they never nest inside the edit form.
- **Auth:** every page and action calls `requireAdmin()` from `app/admin/auth.ts`. It is wrapped in React `cache`, so the layout and the page share one lookup.
- **Feedback:** actions redirect back with `?saved=<key>` or `?error=<msg>`. `_components/flash.tsx` shows it as a toast (it also defines the messages for each `saved` key) and then strips the parameter.
- After writes, actions call `revalidatePath("/", "layout")`.
- New records are created as drafts (`published: false`).
- List fields such as aims and traditional uses are edited in textareas, one item per line.

## Conventions

- **Database:** SQL migrations live in `supabase/migrations/000N_*.sql`. They are run manually in the Supabase SQL Editor and must be safe to re-run (`if not exists`, `drop policy if exists`, seed rows guarded by `where not exists`).
- **Access rules:** the public can read rows where `published`. Authenticated users can do everything.
- **Fallback content:** each `lib` getter falls back to hard-coded content that mirrors the migration's seed rows when `isMissingTable(error)` is true, so the site still works before migrations have run. When a query embeds another table (e.g. `lab:labs(slug, name)`), a missing table reports as `PGRST200`, not `PGRST205`.
- **Error handling:** the header and home-page sections catch data errors (`.catch(() => [])`) and hide themselves rather than crash the page.
- **Tailwind classes:** never build class names dynamically. Use static lookup maps instead (see `statColumns` / `factColumns`).
- **Imports:** use relative imports for project code. Import shadcn components with the `@/components/ui/...` alias, as the shadcn CLI generates them. Match the existing dense JSX style.
- **Adding a content type:** follow `admin/(dashboard)/publications` for each piece:
  - a migration;
  - a `lib/<type>.ts` getter with fallback data;
  - admin list, edit and actions files;
  - its `saved` messages in `_components/flash.tsx`;
  - a nav entry in `_components/app-sidebar.tsx`;
  - a card in `admin/(dashboard)/page.tsx`;
  - search coverage in `app/search/page.tsx`.

## Status (update this section as work progresses)

Last updated 2026-10-13. Develop on `site-buildout`. `main` is the GitHub default branch, and Vercel deploys it (remote: github.com/benansah/researchlab). All work so far, including the shadcn admin and the plant share button, was merged into `main` and pushed on 2026-10-13. Only merge or push to `main` when asked. `master` and `emma` on GitHub are stale. Vercel needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set, or every page returns a 500 error.

Dev tip: this machine has 8 GB of RAM, and `next dev` can die with "out of memory". Don't run `next build` while the user's dev server is running; it corrupts `.next` and every route returns 404. To fix that, stop the server, delete `.next`, and restart.

Done: labs, physic garden, publications, news and events, search, about, services and contact, the redesigned home page, and admin CRUD for all four content types.

Outstanding (mostly on the owner's side):
- [x] All migrations 0001–0004 have been run in Supabase (0004 on 2026-10-13; seed publications and news are live).
  - The live project had an older, empty `publications` table. 0004 upgrades it in place, which was tested in PGlite against fresh, empty and populated old tables.
- [ ] There is an unused old `news` table. The site uses `news_posts`. `news` can be dropped once confirmed empty.
- [ ] Replace the placeholder content via `/admin`: lab leads ("Dr. Harley" etc.), "Student Name" members, the 4 seed publications and the 3 news posts.
- [ ] Confirm the contact email. `cpnpdd@uhas.edu.gh` is used everywhere; the old contact page used `researchlab@uhas.edu.gh`.
- [ ] Confirm the services list and the About mission and values copy in `site-content.ts` and `app/about/page.tsx`.
- [ ] The admin was rebuilt with shadcn/ui on 2026-10-13. Login and redirects were verified, but no signed-in page has been click-tested yet (Claude has no admin account). Check create, save, publish and delete in every section, and add, edit and remove a lab member.
- [x] Merged into `main` and pushed (2026-10-13).
- [ ] Confirm the Vercel deploy works after the merge.
