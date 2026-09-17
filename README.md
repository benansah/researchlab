This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Admin Login

1. Copy `.env.example` to `.env.local`.
2. In Supabase Project Settings, copy the Project URL into `NEXT_PUBLIC_SUPABASE_URL` and the publishable/anon key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. In Supabase Authentication > Users, create the first admin user with email and password.
4. Start the app and open [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

The `/admin` route is protected by Supabase session cookies. New users are not created from the public login form; add administrators through the Supabase dashboard. Never put the Supabase service-role key in a `NEXT_PUBLIC_` variable or browser code.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
