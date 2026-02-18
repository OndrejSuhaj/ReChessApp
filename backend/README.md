# ReChess Backend

Backend service for ReChess application built with Prisma ORM and PostgreSQL.

## Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

## Architecture

This backend implements the architecture specified in:
- `spec/00-architecture/ARCH0003-Target-Architecture-v0.2.md`

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
- **Framework**: (To be added in future phases)

## Development Workflow

1. Start PostgreSQL: `docker compose up -d`
2. Install dependencies: `npm install`
3. Generate Prisma Client: `npm run prisma:generate`
4. Apply migrations: `npm run prisma:migrate:dev`
5. Browse data: `npm run prisma:studio`

## Current Phase

**Phase 2** (v0.2): Database setup and migrations

- ✅ Prisma schema defined
- ✅ Docker Compose configuration
- ✅ Initial migration created
- ✅ Development tooling configured
- ⏳ API routes (future phase)

## Related Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Setup guide
- [spec/00-architecture/ARCH0003-Target-Architecture-v0.2.md](../spec/00-architecture/ARCH0003-Target-Architecture-v0.2.md) - Architecture spec
