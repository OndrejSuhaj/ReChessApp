# Quick Start Guide

## Prerequisites

- Node.js >= 20.0.0
- Docker (for PostgreSQL)
- Google OAuth Client ID

## Setup Steps

### 1. Start PostgreSQL

```bash
cd backend
docker-compose up -d
```

Verify PostgreSQL is running:
```bash
docker-compose ps
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set:
- `DATABASE_URL`: PostgreSQL connection string (default should work with docker-compose)
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `FRONTEND_URL`: Frontend URL for CORS (e.g., http://localhost:8081)

### 4. Run Database Migrations

```bash
npm run prisma:generate
npm run prisma:migrate:dev
```

This will:
- Generate Prisma client
- Create database tables
- Apply migrations

### 5. (Optional) Seed Lessons

```bash
npm run db:seed
```

This will populate the database with lesson content from the frontend's JSON files.

### 6. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the PORT in .env).

## Development Workflow

### View Database

```bash
npm run prisma:studio
```

Opens Prisma Studio at `http://localhost:5555` for visual database inspection.

### Reset Database

```bash
npm run db:reset
```

**Warning**: This will delete all data and re-run migrations.

### Type Checking

```bash
npm run type-check
```

### Build for Production

```bash
npm run build
npm start
```

## Database Schema

See `prisma/schema.prisma` for the complete schema.

Key models:
- **User**: Authenticated users (EN0005)
- **Lesson**: Lesson content as JSONB (EN0001)
- **LessonProgress**: User progress per lesson (EN0006)

## API Endpoints (To Be Implemented)

- `POST /api/auth/login` - UC0010: User login
- `POST /api/auth/logout` - UC0011: User logout
- `GET /api/lessons` - UC0012: Get lesson list
- `GET /api/lessons/:id` - UC0013: Get lesson detail
- `POST /api/lessons/:id/start` - UC0014: Start/resume lesson
- `POST /api/lessons/:id/complete` - UC0015: Complete lesson

## Troubleshooting

### PostgreSQL Connection Issues

1. Check if Docker container is running:
   ```bash
   docker-compose ps
   ```

2. Check logs:
   ```bash
   docker-compose logs postgres
   ```

3. Restart containers:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Prisma Issues

1. Regenerate client:
   ```bash
   npm run prisma:generate
   ```

2. Reset migrations:
   ```bash
   npm run db:reset
   ```

### Port Already in Use

Change `PORT` in `.env` file or stop the process using port 3000:
```bash
lsof -ti:3000 | xargs kill -9
```

## Architecture References

- See `spec/00-architecture/ARCH0003-Target-Architecture-v0.2.md`
- See `backend/README.md` for detailed documentation
- See `backend/IMPLEMENTATION_STATUS.md` for current status

## Next Steps

After setup, you can:
1. Review service implementations in `src/services/`
2. Review type definitions in `src/types/domain.ts`
3. Implement route handlers (next phase)
4. Test API endpoints with frontend integration
