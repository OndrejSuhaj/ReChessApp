# ReChess Backend - Quick Start Guide

This guide will help you set up the ReChess backend with Prisma ORM and PostgreSQL.

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- npm (comes with Node.js)

## Initial Setup

### 1. Start PostgreSQL Database

From the `backend/` directory, start the PostgreSQL container:

```bash
docker compose up -d
```

This will start PostgreSQL on port 5432 with the credentials defined in docker-compose.yml.

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

The default `.env` should contain:

```
DATABASE_URL="postgresql://rechess:rechess@localhost:5432/rechessdb"
```

### 3. Install Dependencies

Install the required npm packages:

```bash
npm install
```

### 4. Generate Prisma Client

Generate the Prisma Client from the schema:

```bash
npm run prisma:generate
```

### 5. Run Database Migrations

Apply the initial migration to create the database schema:

```bash
npm run prisma:migrate:dev
```

When prompted for a migration name, you can use: `init`

### 6. (Optional) Open Prisma Studio

To visually browse and edit your database:

```bash
npm run prisma:studio
```

This will open Prisma Studio in your browser at `http://localhost:5555`.

## Verification

After completing the setup steps above, verify everything is working:

### Check Database Container

```bash
docker compose ps
```

You should see the `rechess-postgres` container running.

### Verify Prisma Client

```bash
npm run prisma:generate
```

Should complete without errors and output: "Generated Prisma Client..."

### Verify Migrations

```bash
npm run prisma:migrate:dev
```

Should show that your database is up to date.

### Verify Prisma Studio

```bash
npm run prisma:studio
```

Should open Prisma Studio and show your three tables: User, Lesson, LessonProgress.

## Available Scripts

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate:dev` - Create and apply migrations in development
- `npm run prisma:migrate:deploy` - Apply migrations in production
- `npm run prisma:studio` - Open Prisma Studio GUI

## Stopping the Database

To stop the PostgreSQL container:

```bash
docker compose down
```

To stop and remove all data:

```bash
docker compose down -v
```

## Troubleshooting

### Port 5432 Already in Use

If you have PostgreSQL running locally, stop it or change the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"  # Map to different local port
```

Then update your `DATABASE_URL` in `.env`:

```
DATABASE_URL="postgresql://rechess:rechess@localhost:5433/rechessdb"
```

### Migration Errors

If you encounter migration errors, you can reset the database:

```bash
docker compose down -v
docker compose up -d
npm run prisma:migrate:dev
```

## Next Steps

The backend is now ready for development. You can:

1. Start building API routes (not included in Phase 2)
2. Use Prisma Studio to manually manage data
3. Write seed scripts for test data
