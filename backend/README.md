# Dakshath Backend

Backend API server for Dakshath Job/Internship Platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials and configuration.

4. Run migrations:
```bash
npm run migrate
```

5. Start development server:
```bash
npm run dev
```

## Environment Variables

See `.env.example` for required environment variables.

## API Endpoints

- `/api/health` - Health check
- `/api/auth/*` - Authentication endpoints
- `/api/jobs/*` - Job listing endpoints
- `/api/applications/*` - Application endpoints
- `/api/students/*` - Student profile endpoints
- `/api/companies/*` - Company endpoints
- `/api/hr/*` - HR dashboard endpoints
- `/api/admin/*` - Admin endpoints
- `/api/notifications/*` - Notification endpoints

## Database

The backend uses the same PostgreSQL database as the LMS system. Make sure the database user has:
- Read-only access to LMS tables
- Full access to Dakshath tables

