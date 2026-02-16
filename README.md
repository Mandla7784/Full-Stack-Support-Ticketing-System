# Full-Stack Support Ticketing System

A support ticketing system built with Next.js, React, Tailwind CSS, and PostgreSQL. Users can sign up, log in, create and manage tickets, add comments, filter by status and priority, and assign tickets. The app uses server actions for creating tickets and API routes for updates and comments.

## Features

- **User authentication** – Sign up and sign in with email and password (NextAuth credentials)
- **Tickets** – Create tickets with title, description, status, priority, and category
- **Ticket list** – View all tickets with filters (status, priority) and search
- **Ticket detail** – View a ticket, update status, and add comments
- **Assignments** – Assign tickets to users
- **Comments** – Add and view comments on tickets
- **Dark UI** – Themed layout with ticket icons (react-icons)

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes, server actions, PostgreSQL, Prisma ORM
- **Authentication:** NextAuth.js (credentials provider, JWT)
- **Icons:** react-icons
- **Monitoring (optional):** Sentry (production only when `SENTRY_DSN` is set)

## Tech Stack (detailed)

- Next.js 16
- React 19
- Tailwind CSS 4
- PostgreSQL
- Prisma ORM (v6)
- NextAuth.js (credentials + JWT)
- bcryptjs (password hashing)
- TypeScript
- react-icons
- Vercel (suitable for deployment)

## Getting Started

All commands below are run from the **`quick-ticket`** directory.

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd Full-Stack-Support-Ticketing-System/quick-ticket
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   If you see an EPERM error during `prisma generate` (e.g. on Windows), run `npm run generate` later when no other process is using the project folder.

3. **Environment variables**  
   Create a `.env` file in `quick-ticket` with:
   - `DATABASE_URL` – PostgreSQL connection string (e.g. from Neon or `.env.sentry-build-plugin`)
   - `NEXTAUTH_SECRET` – Secret for NextAuth (e.g. `openssl rand -base64 32`)
   - `NEXTAUTH_URL` – App URL (e.g. `http://localhost:3000` for dev)

4. **Database**

   ```bash
   npm run generate
   npm run db:deploy
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open the app**  
   Visit [http://localhost:3000](http://localhost:3000). Sign up, then sign in to use tickets.

## Scripts

| Script              | Description                      |
| ------------------- | -------------------------------- |
| `npm run dev`       | Start Next.js dev server         |
| `npm run build`     | Generate Prisma client and build |
| `npm run start`     | Start production server          |
| `npm run generate`  | Generate Prisma client only      |
| `npm run db:deploy` | Apply migrations to database     |
