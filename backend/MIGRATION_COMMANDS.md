# Migration Commands Guide

This guide explains how to check and manage database migrations for Dakshath.

## Check Migration Status

To see which migrations are applied (up) and which are pending (down):

```bash
npm run migrate:status
```

Or directly:
```bash
npx sequelize-cli db:migrate:status
```

**Output Example:**
```
up   001-create-companies.js
up   002-create-hr-users.js
down 003-create-job-listings.js
down 004-create-applications.js
```

- **`up`** = Migration has been applied ✅
- **`down`** = Migration is pending (not yet applied) ⏳

## Run Migrations

Apply all pending migrations:
```bash
npm run migrate
```

Or directly:
```bash
npx sequelize-cli db:migrate
```

## Undo Migrations

### Undo Last Migration
```bash
npm run migrate:undo
```

Or directly:
```bash
npx sequelize-cli db:migrate:undo
```

### Undo All Migrations
```bash
npm run migrate:undo:all
```

Or directly:
```bash
npx sequelize-cli db:migrate:undo:all
```

## Migration Files Location

Migrations are located in: `Dakshath/backend/migrations/`

## How Migrations Work

1. **SequelizeMeta Table**: Sequelize creates a `SequelizeMeta` table in your database to track which migrations have been run.

2. **Migration Order**: Migrations are executed in alphabetical/numerical order based on their filenames.

3. **Status Check**: The `migrate:status` command queries the `SequelizeMeta` table to show which migrations are up or down.

## Troubleshooting

### If migrations fail:
1. Check the error message
2. Fix the issue in the migration file
3. If needed, undo the failed migration: `npm run migrate:undo`
4. Fix the migration file
5. Run migrations again: `npm run migrate`

### To see detailed migration info:
```bash
npx sequelize-cli db:migrate:status --verbose
```

### Check database connection:
Make sure your `.env` file has correct database credentials:
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_DATABASE` or `DB_NAME`

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run migrate:status` | Check which migrations are up/down |
| `npm run migrate` | Apply all pending migrations |
| `npm run migrate:undo` | Undo the last migration |
| `npm run migrate:undo:all` | Undo all migrations |

