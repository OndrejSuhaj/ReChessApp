# ReChess Backend

Backend service for ReChess application built with Prisma ORM and PostgreSQL.

## Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

## Architecture

This backend implements the architecture specified in:
- `spec/00-architecture/ARCH0004-Target-Architecture-v0.3.md`

## Data Models

The backend manages three main entities:

1. **User** (EN0005) - Authenticated users via Google OAuth
2. **Lesson** (EN0001) - Chess training lesson content
3. **LessonProgress** (EN0006) - User progress through lessons

See `prisma/schema.prisma` for the complete data model.

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Framework**: Fastify

## Environment Variables

Copy `.env.example` to `.env` and configure the following:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `GOOGLE_CLIENT_ID` | yes | Google OAuth client ID for token verification |
| `JWT_SECRET` | yes | Secret key for signing JWT access tokens (use a long random string in production) |
| `ADMIN_EMAILS` | no | Comma-separated list of emails granted Admin role on login (default: `o.suhaj@gmail.com`) |
| `FRONTEND_URL` | no | Frontend origin for CORS (default: `http://localhost:8081`) |
| `PORT` | no | Server port (default: `3000`) |

## Auth Endpoints

### `POST /auth/login`

Google login (UC0010). Verifies a Google ID token and returns session tokens.

**Request body:**
```json
{ "idToken": "<Google ID token>" }
```

**Response:**
```json
{
  "accessToken": "<JWT>",
  "refreshToken": "<opaque token>",
  "user": { "id", "email", "displayName", "photoUrl", "role" }
}
```

### `POST /auth/refresh`

Refresh session (UC0016). Exchanges a valid refresh token for a new access token.

**Request body:**
```json
{ "refreshToken": "<opaque token>" }
```

**Response:**
```json
{ "accessToken": "<JWT>" }
```

## Development Workflow

1. Start PostgreSQL: `docker compose up -d`
2. Install dependencies: `npm install`
3. Generate Prisma Client: `npm run prisma:generate`
4. Apply migrations: `npm run prisma:migrate:dev`
5. Start dev server: `npm run dev`

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build production bundle
- `npm run start` - Start production server (requires build first)
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate:dev` - Create and apply migrations in development
- `npm run prisma:migrate:deploy` - Apply migrations in production
- `npm run prisma:studio` - Open Prisma Studio GUI
