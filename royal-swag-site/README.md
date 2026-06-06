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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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

## Admin dashboard (`/admin/login`)

Only you can create the database and paste secrets into Vercel—the app cannot do that automatically. Do this once:

1. **Create a PostgreSQL database** (e.g. [Supabase](https://supabase.com)) and copy the **URI** (Project Settings → Database). Do not use a placeholder like `localhost:5432`.
2. **Set `DATABASE_URL`** in **`.env.local`** and in **Vercel → Environment Variables** (Production) to that URI.
3. **Apply the schema** (creates `AdminSession`, orders, lung tests, etc.):

   ```bash
   npm run db:generate
   npm run db:push
   ```

   (`db:push` loads `.env.local` via `dotenv-cli`; Prisma CLI does not read `.env.local` by itself.)

4. **Admin credentials** — choose a username and password, then hash the password:

   ```bash
   npm run admin:hash-password -- "YourSecurePassword"
   ```

   Paste the printed hex into **`ADMIN_PASSWORD_HASH`**. Set **`ADMIN_USERNAME`** to the exact username you will type at login. Add both to `.env.local` and Vercel.
5. **Deploy / redeploy**, then open **`https://your-domain/admin/login`**.

The dashboard loads orders and lung tests from Postgres. See `.env.example` for related keys.
