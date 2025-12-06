# Dakshath - Job/Internship Platform

Dakshath is a job and internship discovery platform that connects students with career opportunities based on their academic performance from the LMS system.

## Project Structure

```
Dakshath/
├── backend/          # Node.js/Express backend
├── frontend/         # React frontend
└── [Documentation]   # Project documentation files
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd Dakshath/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials and configuration.

5. Run database migrations:
```bash
npm run migrate
```

6. Start development server:
```bash
npm run dev
```

Backend will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd Dakshath/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Features

- **Student Portal**: Browse jobs, apply to positions, track applications
- **HR Portal**: Post jobs, manage applications, review candidates
- **Admin Portal**: Manage companies, users, and platform operations
- **Score-Based Matching**: Students can only apply if they meet score requirements
- **Real-time Notifications**: Get updates on application status changes

## Technology Stack

### Backend
- Node.js with Express.js
- PostgreSQL (shared with LMS)
- Sequelize ORM
- JWT Authentication
- Google OAuth 2.0

### Frontend
- React 18
- Vite
- React Router v6
- TanStack Query
- Tailwind CSS
- React Hook Form

## Database

Dakshath shares the same PostgreSQL database as the LMS system. Make sure:
- Database user has read-only access to LMS tables
- Database user has full access to Dakshath tables
- All migrations are run before starting the application

## Default Credentials

For default login credentials, see [DEFAULT_CREDENTIALS.md](./DEFAULT_CREDENTIALS.md)

**Quick Reference:**
- **Admin:** `admin@lms.com` / `admin123` (shared with LMS)
- **Students:** Use their LMS credentials (email/password or Google OAuth)
- **HR:** Created by admin (no default credentials)

## API Documentation

See the Architecture Design Document for complete API endpoint documentation.

## License

ISC

