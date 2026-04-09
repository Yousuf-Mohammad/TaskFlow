# Task Management System — Frontend

The frontend for the Task Management System, built with Next.js 15 App Router. It provides a role-based UI for admins to manage tasks, users, and audit logs, and for regular users to view and update their assigned tasks.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16 (App Router)](https://nextjs.org) | React framework, routing, server components |
| [React 19](https://react.dev) | UI rendering |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com) | Pre-built accessible UI components |
| [Redux Toolkit](https://redux-toolkit.js.org) | Global state management |
| [React Redux](https://react-redux.js.org) | React bindings for Redux |
| [jwt-decode](https://github.com/auth0/jwt-decode) | Decode JWT tokens on the client |
| [Lucide React](https://lucide.dev) | Icon library |
| [Sonner](https://sonner.emilkowal.ski) | Toast notifications |

---

## Architecture

The app follows the **Next.js App Router** conventions with a clear separation between server and client components.

### State Management

Global state is managed with **Redux Toolkit**. Each domain has its own slice with async thunks that call the backend API using native `fetch()`.

```
store/
├── index.ts              ← configureStore (auth, tasks, users, auditLogs)
├── hooks.ts              ← typed useAppDispatch / useAppSelector
└── slices/
    ├── authSlice.ts      ← login, logout, token persistence
    ├── tasksSlice.ts     ← CRUD for tasks
    ├── usersSlice.ts     ← CRUD for users (admin only)
    └── auditLogSlice.ts  ← fetch audit logs (admin only)
```

### Route Groups

Routes are organized into **Next.js route groups** to keep role-based pages separate:

| Route Group | Path | Access |
|---|---|---|
| `(auth)` | `/login` | Public |
| `(admin)` | `/dashboard`, `/users`, `/audit-logs` | Admin only |
| `(user)` | `/my-tasks` | User only |

Route protection is handled client-side by reading the role from the decoded JWT stored in `localStorage`.

### Component Structure

```
components/
├── admin/
│   ├── TaskTable.tsx       ← Full task list with edit/delete actions
│   ├── TaskFormModal.tsx   ← Create/edit task modal (with assignee dropdown)
│   ├── UserTable.tsx       ← User list with edit/delete actions
│   ├── UserFormModal.tsx   ← Create/edit user modal
│   └── AuditLogTable.tsx   ← Read-only audit log viewer
├── user/
│   └── MyTaskTable.tsx     ← Assigned tasks with status update
├── shared/
│   ├── Navbar.tsx          ← Top navigation bar (role-aware)
│   ├── StatusBadge.tsx     ← Colored badge for task status
│   ├── LoadingSpinner.tsx  ← Reusable loading indicator
│   └── StoreProvider.tsx   ← Redux Provider wrapper for App Router
└── ui/                     ← shadcn/ui generated components
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── input.tsx
    ├── select.tsx
    ├── table.tsx
    └── ...
```

### Utilities

```
lib/
├── api.ts      ← Thin fetch wrappers for each backend endpoint
├── auth.ts     ← JWT decode helpers and role checks
├── types.ts    ← Shared TypeScript interfaces (Task, User, AuditLog, etc.)
└── utils.ts    ← cn() helper (clsx + tailwind-merge)
```

---

## Folder Structure

```
frontend/
├── app/
│   ├── (admin)/
│   │   ├── dashboard/page.tsx
│   │   ├── users/page.tsx
│   │   └── audit-logs/page.tsx
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (user)/
│   │   └── my-tasks/page.tsx
│   ├── layout.tsx          ← Root layout (StoreProvider, Toaster)
│   ├── page.tsx            ← Root redirect (/ → /login or /dashboard)
│   └── globals.css
├── components/
│   ├── admin/
│   ├── user/
│   ├── shared/
│   └── ui/                 ← shadcn/ui components
├── store/
│   ├── index.ts
│   ├── hooks.ts
│   └── slices/
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── types.ts
│   └── utils.ts
├── .env.local
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Environment Variables

Create a `.env.local` file in this directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

This should point to the running NestJS backend. For Docker, the backend is exposed on port `3000`.

---

## Running the App

### Prerequisites

- Node.js 20+
- The backend API must be running (see the root `README.md`)

### Development

```bash
# Install dependencies
npm install

# Start the dev server (runs on http://localhost:3001)
npm run dev
```

### Production Build

```bash
npm run build
npm run start
```

### Via Docker Compose (recommended)

From the project root:

```bash
docker compose up --build
```

The frontend will be available at `http://localhost:3001`.

---

## Authentication

- JWT token is stored in `localStorage` after login.
- The token is decoded client-side using `jwt-decode` to extract the user's role (`ADMIN` or `USER`).
- All protected routes check the role from the decoded token and redirect to `/login` if unauthenticated.

> **Security note:** `localStorage` is used here for simplicity in this demo app. In a production environment, storing tokens in `httpOnly` cookies is the recommended approach to prevent XSS exposure.

---

## Default Credentials

| Email | Password | Role |
|---|---|---|
| admin@app.com | admin123 | ADMIN |
| user@app.com | user123 | USER |
