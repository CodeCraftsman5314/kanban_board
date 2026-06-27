# Team Kanban

A real-time collaborative Kanban board built with Next.js, Supabase, and TypeScript.

**Next.js 16** | **React 19** | **TypeScript** | **Tailwind CSS 4** | **Supabase** | **Vercel**

---

## Screenshots

![Board View](./screenshots/board-empty-light.png)
![Card View](./screenshots/card-view-modal-expanded.png)

> Screenshots are from the development environment running locally.

---

## Features

- Real-time board sync across multiple users (Supabase Realtime)
- Live presence indicator showing connected user count
- Drag and drop cards between columns with optimistic updates
- Three-mode card editor: create, view, and edit
- Subtasks support per card
- Priority levels, labels, and due dates on cards
- Collapsible sidebar navigation
- Dark / light mode toggle
- Skeleton loading states on initial board load
- Inline card creation loading state
- Real-time search across card titles, descriptions, and labels
- Responsive layout from tablet to 4K

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Realtime | Supabase Realtime + Presence |
| Monorepo | Turborepo + pnpm workspaces |
| Deployment | Vercel |

---

## Architecture

The project is a Turborepo monorepo with one application (`apps/web`) and a shared types package (`packages/types`). All TypeScript interfaces — `Column`, `Card`, `Priority`, and the `Database` schema type — live in `packages/types` and are consumed by the web app.

Inside the app, concerns are layered: `kanban.service.ts` handles all raw Supabase calls, `useBoard` and `usePresence` wrap those calls in React state and subscriptions, and components only talk to hooks — never to the service layer directly. This keeps data-fetching logic easy to test and replace independently of the UI.

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A Supabase project (free tier works)

### 1. Clone the repository

```bash
git clone <repo-url>
cd kanban-board
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up Supabase

Create a project at [supabase.com](https://supabase.com), then run the following SQL in the Supabase SQL Editor:

```sql
-- Create columns table
create table public.columns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

-- Create cards table
create table public.cards (
  id uuid primary key default gen_random_uuid(),
  column_id uuid references public.columns(id) on delete cascade,
  title text not null,
  description text,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  label text,
  priority text not null default 'none',
  due_date date,
  subtasks jsonb not null default '[]'::jsonb
);

-- Enable Row Level Security
alter table public.columns enable row level security;
alter table public.cards enable row level security;

-- Allow public read/write (no auth required for this project)
create policy "Public read columns" on public.columns for select using (true);
create policy "Public write columns" on public.columns for all using (true);
create policy "Public read cards" on public.cards for select using (true);
create policy "Public write cards" on public.cards for all using (true);

-- Enable Realtime
alter publication supabase_realtime add table public.columns;
alter publication supabase_realtime add table public.cards;

-- Seed default columns
insert into public.columns (title, "order") values
  ('To Do', 0),
  ('In Progress', 1),
  ('Done', 2);
```

### 4. Configure environment variables

```bash
cp apps/web/.env.example apps/web/.env.local
```

Fill in your Supabase project URL and anon key from:
**Supabase Dashboard → Settings → API**

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment (Vercel)

1. Push the repository to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Set the **Root Directory** to `apps/web`
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

---

## Project Structure

```
kanban-board/
├── apps/
│   └── web/                    # Next.js application
│       └── src/
│           ├── app/            # App Router pages and layout
│           ├── components/
│           │   ├── atoms/      # Button, Badge, Spinner, Dot
│           │   ├── molecules/  # ConnectionBadge, Modal, FormField
│           │   └── organisms/  # KanbanBoard, KanbanColumn, KanbanCard
│           ├── hooks/          # useBoard, usePresence
│           ├── services/       # kanban.service.ts (Supabase calls)
│           ├── types/          # Local TypeScript types
│           └── constants/      # App-wide string constants
└── packages/
    └── types/                  # Shared types across packages
```

---

## How Realtime Works

Both the `columns` and `cards` tables have Supabase Realtime enabled via `supabase_realtime` publication. `useBoard` subscribes to `INSERT`, `UPDATE`, and `DELETE` events on both tables — any change made by one user is immediately pushed to every connected client, which triggers a board refresh. `usePresence` uses a separate Supabase Presence channel: each browser session calls `channel.track()` on connect and the presence state is synced on `join`, `leave`, and `sync` events. The connection badge reflects live status and the exact count of active users in real time.

---

## Trade-offs and What I'd Improve

### Trade-offs made

- **No authentication** — The board is public-access for simplicity. Adding Supabase Auth would take ~2 hours but was out of scope.
- **Single board** — The app manages one shared board. Multi-board support would require a `boards` table and routing per board.
- **Order on move** — Cards dropped into a column always append to the bottom. True position-aware reordering would need fractional indexing (e.g. lexicographic ordering).
- **No conflict resolution** — If two users edit the same card simultaneously, last write wins. Proper CRDT-based merging is complex and out of scope.
- **Client-side search** — Search filters already-loaded cards in memory. For large boards, server-side full-text search with Postgres `tsvector` would scale better.

### What I'd add with more time

- User authentication and per-user boards
- Multiple boards with a dashboard view
- Card comments and activity log
- File attachments via Supabase Storage
- Keyboard shortcuts (j/k navigation, `n` for new card)
- Unit tests for the service layer (Jest)
- Integration tests for board interactions (React Testing Library + MSW)
- End-to-end tests (Playwright)
- Position-aware drag and drop with fractional ordering
- Mobile-first drag and drop (touch events)
- Card archiving instead of hard delete
