# ReChess Backend v0.2

Minimal backend service for ReChess chess trainer providing persistence and authentication.

## Architecture

This backend implementation follows **ARCH0003 – Target Architecture v0.2**.

### What This Backend Does

- ✅ Verify Google ID tokens (SRV0002)
- ✅ Persist User records (EN0005)
- ✅ Persist Lesson content in PostgreSQL (EN0001)
- ✅ Persist LessonProgress (EN0006)
- ✅ Seed lessons from JSON files (SRV0006)
- ✅ Expose minimal REST API for lesson management

### What This Backend Does NOT Do

- ❌ Implement chess engine logic
- ❌ Evaluate chess positions
- ❌ Calculate best moves
- ❌ Execute deterministic scripts (frontend-only)
- ❌ Issue custom JWT sessions
- ❌ Store runtime RunState

## Technology Stack

- **Runtime**: Node.js (>=20.0.0)
- **Language**: TypeScript
- **Web Framework**: Fastify
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: Google OAuth (ID token verification)

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma           # Prisma database schema
├── src/
│   ├── services/               # Service layer implementations
│   │   ├── userService.ts      # SRV0003 – UserService
│   │   ├── lessonService.ts    # SRV0004 – LessonService
│   │   ├── lessonProgressService.ts  # SRV0005 – LessonProgressService
│   │   └── lessonSeedService.ts      # SRV0006 – LessonSeedService
│   ├── types/
│   │   └── domain.ts           # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   └── index.ts                # Application entry point
├── package.json
├── tsconfig.json
└── .env.example
```

## Database Schema

### User (EN0005)
- Stores authenticated user identity from Google OAuth
- `googleSub` is unique identifier from Google
- Tracks `lastLoginAt` for activity monitoring

### Lesson (EN0001)
- Stores deterministic lesson content
- `exercises` stored as JSONB (array of Exercise objects)
- Seeded from JSON files in frontend `/src/data/`

### LessonProgress (EN0006)
- Tracks user progress per lesson
- Unique constraint on `(userId, lessonId)`
- Status: `InProgress` or `Completed`
- Never stores `RunState` (runtime-only in frontend)

## Setup

### Prerequisites

- Node.js >= 20.0.0
- PostgreSQL database
- Google OAuth Client ID

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run database migrations:
```bash
npm run prisma:migrate:dev
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Seed lessons (optional):
```bash
npm run db:seed
```

### Development

Start development server:
```bash
npm run dev
```

### Production

Build and start:
```bash
npm run build
npm start
```

## Environment Variables

See `.env.example` for required configuration:

- `DATABASE_URL`: PostgreSQL connection string
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `PORT`: Server port (default: 3000)
- `FRONTEND_URL`: Frontend URL for CORS

## Database Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Create and apply migration
npm run prisma:migrate:dev

# Apply migrations in production
npm run prisma:migrate:deploy

# Open Prisma Studio (GUI)
npm run prisma:studio

# Reset database (development only)
npm run db:reset

# Seed lessons
npm run db:seed
```

## Specification Compliance

This implementation strictly follows:

### Entities
- EN0005 – User
- EN0006 – LessonProgress
- EN0001 – Lesson
- EN0002 – Exercise
- EN0003 – Ply

### Services
- SRV0002 – GoogleTokenVerificationService
- SRV0003 – UserService
- SRV0004 – LessonService
- SRV0005 – LessonProgressService
- SRV0006 – LessonSeedService

### Use Cases
- UC0010 – User logs in via Google
- UC0011 – User logs out
- UC0012 – GetLessonList
- UC0013 – GetLessonDetail
- UC0014 – StartOrResumeLesson
- UC0015 – CompleteLesson

## Constraints

The backend remains **stateless** regarding authentication:
- No session store
- No custom JWT issuance
- Google ID token verified per request
- No caching layer

The backend remains **minimal**:
- No chess engine
- No move evaluation
- No script execution
- No attempt history
- No spaced repetition
- No role system
- No admin UI

## Docker Setup (PostgreSQL)

Example `docker-compose.yml` for local development:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: rechess
      POSTGRES_PASSWORD: password
      POSTGRES_DB: rechess
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Run with:
```bash
docker-compose up -d
```

## License

MIT
