# Task Management System — Backend

NestJS REST API with role-based access control, JWT authentication, and full audit logging.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | NestJS 11 (TypeScript) |
| Database | PostgreSQL 18 |
| ORM | TypeORM 0.3 |
| Auth | JWT via `@nestjs/jwt` + Passport |
| Validation | `class-validator` + `class-transformer` |
| Config | `@nestjs/config` (`.env` via `dotenv`) |
| Password hashing | `bcrypt` (salt rounds: 10) |
| Containerization | Docker + Docker Compose |

---

## Architectural Decisions

### Module-per-feature structure
Each domain lives in its own folder under `src/`. NestJS modules enforce explicit dependency boundaries — a module must export a provider before another module can inject it.

### JWT in Authorization header
Tokens are issued on login and expected as `Authorization: Bearer <token>` on every protected request. The JWT payload carries `{ sub, email, role }` so no extra DB lookup is needed per request.

### Role enforcement at two levels
- `JwtAuthGuard` (Passport strategy) — verifies the token is valid and populates `req.user`
- `RolesGuard` + `@Roles()` decorator — reads `user.role` from the decoded payload and compares against the metadata set on the route handler

### Audit logging as a shared service
`AuditLogService.log()` is exported from `AuditLogModule` and injected into `TasksService`. Every task mutation records a `dataBefore` / `dataAfter` JSON snapshot with a typed action string (`TASK_CREATED`, `TASK_UPDATED`, `TASK_DELETED`, `STATUS_CHANGED`, `ASSIGNMENT_CHANGED`).

### TypeORM `synchronize: true`
Schema is auto-synced from entity definitions on every startup. Intentional for development; should be replaced with migrations before going to production.

### Token storage note
The frontend stores JWTs in `localStorage`. Simple and sufficient for a demo. In production, `httpOnly` cookies eliminate XSS token theft risk.

---

## Folder Structure

```
backend/
├── src/
│   ├── app.module.ts          # Root module — wires TypeORM, ConfigModule, feature modules
│   ├── main.ts                # Bootstrap — ValidationPipe, CORS, port 3000
│   │
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts        # login() — bcrypt compare, JWT sign
│   │   ├── auth.controller.ts     # POST /auth/login
│   │   ├── jwt.strategy.ts        # Passport JWT strategy
│   │   ├── jwt-auth.guard.ts      # @UseGuards(JwtAuthGuard)
│   │   ├── roles.guard.ts         # Checks req.user.role vs @Roles() metadata
│   │   ├── roles.decorator.ts     # @Roles(Role.ADMIN)
│   │   ├── current-user.decorator.ts  # @CurrentUser() param decorator
│   │   └── login.dto.ts
│   │
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.service.ts       # CRUD — password stripped from all responses
│   │   ├── users.controller.ts    # All routes admin-only
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   │
│   ├── tasks/
│   │   ├── tasks.module.ts
│   │   ├── tasks.service.ts       # All business logic + calls AuditLogService
│   │   ├── tasks.controller.ts    # CRUD routes
│   │   └── dto/
│   │       ├── create-task.dto.ts
│   │       └── update-task.dto.ts
│   │
│   ├── audit-log/
│   │   ├── audit-log.module.ts
│   │   ├── audit-log.service.ts   # log() method + findAll()
│   │   ├── audit-log.controller.ts # GET /audit-logs (admin only)
│   │   └── audit-log.constants.ts # ACTION_TYPES constant map
│   │
│   └── database/
│       ├── user.entity.ts         # users table — id, firstName, lastName, email, password, role, createdAt
│       ├── task.entity.ts         # tasks table — id, title, description, status, assignedUser, timestamps
│       ├── audit-log.entity.ts    # audit_logs table — actor, actionType, targetTaskId, dataBefore, dataAfter
│       └── seed.ts                # Standalone seed script (ts-node)
│
├── .env                   # Active env vars (DB_HOST=postgres for Docker)
├── .env.example           # Template (DB_HOST=localhost for local dev)
├── Dockerfile
├── nest-cli.json
├── tsconfig.json
└── package.json
```

---

## Roles

| Role | Permissions |
|---|---|
| `ADMIN` | Create / update / delete tasks, assign tasks, view audit logs, manage users |
| `USER` | View own assigned tasks, update task status only |

---

## API Endpoints

All protected routes require:
```
Authorization: Bearer <jwt_token>
```

### Auth

| Method | Path | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/auth/login` | Public | `{ email, password }` | Returns `{ access_token }` |

### Users

| Method | Path | Auth | Body | Description |
|---|---|---|---|---|
| GET | `/users` | ADMIN | — | List all users (password omitted) |
| POST | `/users` | ADMIN | `{ firstName, lastName, email, password }` | Create user, default role `USER` |
| PATCH | `/users/:id` | ADMIN | `{ firstName?, lastName?, role? }` | Update name or change role |
| DELETE | `/users/:id` | ADMIN | — | Delete user, returns `204` |

### Tasks

| Method | Path | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/tasks` | ADMIN | `{ title, description?, assignedUserId? }` | Create a task |
| GET | `/tasks` | Any | — | Admin: all tasks. User: own assigned tasks only |
| GET | `/tasks/:id` | Any | — | Admin: any task. User: own task only |
| PATCH | `/tasks/:id` | Any | `{ title?, description?, status?, assignedUserId? }` | Admin: any field. User: `status` only |
| DELETE | `/tasks/:id` | ADMIN | — | Delete a task |

**Task status flow:** `PENDING` → `PROCESSING` → `DONE`

### Audit Logs

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/audit-logs` | ADMIN | All logs, newest first, with actor email |

**Logged action types:** `TASK_CREATED`, `TASK_UPDATED`, `TASK_DELETED`, `STATUS_CHANGED`, `ASSIGNMENT_CHANGED`

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DB_HOST` | Postgres host (`postgres` inside Docker, `localhost` locally) | — |
| `DB_PORT` | Postgres port | `5432` |
| `DB_USER` | Postgres username | `postgres` |
| `DB_PASSWORD` | Postgres password | — |
| `DB_NAME` | Database name | `taskdb` |
| `JWT_SECRET` | Secret used to sign/verify JWTs | — |

Copy `.env.example` to `.env` and fill in values before running.

---

## Running Locally (without Docker)

**Prerequisites:** Node 20+, PostgreSQL 18 running locally.

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env — set DB_HOST=localhost and your DB credentials

# 3. Seed the database (creates admin + user accounts)
npm run seed

# 4. Start in dev mode (watch)
npm run start:dev
```

API is available at `http://localhost:3000`.

---

## Running with Docker

```bash
# From the project root
docker-compose up --build
```

This starts:
- `postgres` — PostgreSQL 18, port 5432, named volume `postgres_data`
- `api` — NestJS app, port 3000, waits for Postgres healthcheck before starting

Then seed the database:
```bash
docker-compose exec api npm run seed
```

---

## Seed Users

Created by `npm run seed` — safe to run multiple times (skips existing users).

| Email | Password | Role |
|---|---|---|
| admin@app.com | admin123 | ADMIN |
| user@app.com | user123 | USER |

---

## Scripts

| Script | Description |
|---|---|
| `npm run start:dev` | Dev server with file watching |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start:prod` | Run compiled output |
| `npm run seed` | Seed predefined users into the database |
| `npm run lint` | ESLint with auto-fix |
| `npm run test` | Unit tests |
