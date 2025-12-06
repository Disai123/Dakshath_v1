# Dakshath - Architecture Design Document

**Document Version:** 1.0  
**Date:** November 2025  
**Project:** Dakshath - Job/Internship Platform  
**Document Type:** Technical Architecture Design  
**Prepared by:** Architecture Team

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture Overview](#system-architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Application Architecture](#application-architecture)
5. [Database Architecture](#database-architecture)
6. [API Architecture](#api-architecture)
7. [Integration Architecture](#integration-architecture)
8. [Security Architecture](#security-architecture)
9. [Authentication & Authorization](#authentication--authorization)
10. [Data Flow Architecture](#data-flow-architecture)
11. [Deployment Architecture](#deployment-architecture)
12. [Scalability & Performance](#scalability--performance)
13. [Error Handling & Logging](#error-handling--logging)
14. [Testing Strategy](#testing-strategy)

---

## Executive Summary

### Architecture Overview

Dakshath is built as a separate application that integrates with the existing LMS system through a shared PostgreSQL database. The architecture follows a modern, scalable, and maintainable design pattern with clear separation of concerns.

### Key Architectural Decisions

1. **Shared Database Approach:** Both LMS and Dakshath share the same PostgreSQL database for real-time data access
2. **Separate Application Codebase:** Dakshath maintains independent frontend and backend codebases
3. **RESTful API Design:** Clean, RESTful API architecture for backend services
4. **Component-Based Frontend:** React-based component architecture for maintainability
5. **Role-Based Access Control:** Multi-tier authentication and authorization system
6. **Read-Only LMS Data Access:** Dakshath only reads from LMS tables, never modifies

### Architecture Principles

- **Separation of Concerns:** Clear boundaries between layers
- **Scalability:** Designed to handle growth
- **Security First:** Comprehensive security measures
- **Maintainability:** Clean code and documentation
- **Performance:** Optimized for speed and efficiency
- **Reliability:** Error handling and resilience

---

## System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├──────────────┬──────────────┬───────────────────────────────┤
│ Student      │ HR Portal     │ Admin Portal                   │
│ Portal       │ (React)       │ (React)                        │
│ (React)      │               │                                │
└──────┬───────┴──────┬────────┴───────────────┬───────────────┘
       │              │                        │
       └──────────────┴────────────────────────┘
                      │
       ┌──────────────▼──────────────────────────────┐
       │         API Gateway / Backend Server         │
       │         (Node.js + Express.js)                │
       └──────────────┬───────────────────────────────┘
                      │
       ┌──────────────┴──────────────────────────────┐
       │                                              │
┌──────▼──────┐                            ┌─────────▼────────┐
│  Business   │                            │   Data Access    │
│  Logic      │                            │     Layer        │
│  Layer      │                            │  (Sequelize ORM) │
└──────┬──────┘                            └─────────┬────────┘
       │                                              │
       └──────────────┬───────────────────────────────┘
                      │
       ┌──────────────▼───────────────────────────────┐
       │      Shared PostgreSQL Database               │
       │  ┌──────────────┬──────────────────────────┐ │
       │  │  LMS Tables  │  Dakshath Tables         │ │
       │  │  (Read-only) │  (Read/Write)            │ │
       │  └──────────────┴──────────────────────────┘ │
       └───────────────────────────────────────────────┘
```

### Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
├─────────────────────────────────────────────────────────────┤
│  React Application (Vite)                                    │
│  ├── Pages (Route Components)                               │
│  ├── Components (Reusable UI)                               │
│  ├── Services (API Clients)                                 │
│  ├── Context (State Management)                            │
│  ├── Hooks (Custom Hooks)                                  │
│  └── Utils (Helper Functions)                              │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTP/REST
                          │
┌─────────────────────────────────────────────────────────────┐
│                        Backend Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Node.js + Express.js Application                           │
│  ├── Routes (API Endpoints)                                │
│  ├── Controllers (Request Handlers)                        │
│  ├── Services (Business Logic)                             │
│  ├── Models (Data Models)                                  │
│  ├── Middleware (Auth, Validation, Error Handling)         │
│  └── Utils (Helpers, Validators)                           │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ Sequelize ORM
                          │
┌─────────────────────────────────────────────────────────────┐
│                        Database Layer                        │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL Database                                        │
│  ├── LMS Tables (Read-only access)                         │
│  └── Dakshath Tables (Full access)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Technology

**Core Framework:**
- **React 18+** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing

**State Management:**
- **React Context API** - Global state (Auth, Theme)
- **React Query (TanStack Query)** - Server state management
- **Local State** - useState, useReducer for component state

**UI & Styling:**
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons / Lucide** - Icon library
- **Framer Motion** (optional) - Animations

**HTTP Client:**
- **Axios** - API communication
- **Interceptors** - Request/response handling

**Form Handling:**
- **React Hook Form** - Form validation and management
- **Zod / Yup** - Schema validation

**Development Tools:**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** (optional) - Type safety

---

### Backend Technology

**Runtime & Framework:**
- **Node.js 18+** - JavaScript runtime
- **Express.js 4.x** - Web framework
- **TypeScript** (optional) - Type safety

**Database:**
- **PostgreSQL 15+** - Primary database
- **Sequelize 6.x** - ORM for database access

**Authentication:**
- **Passport.js** - Authentication middleware
- **Google OAuth 2.0** - OAuth strategy
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcrypt** - Password hashing (if needed)

**Validation & Security:**
- **express-validator** - Request validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting

**File Handling:**
- **Multer** - File upload handling
- **AWS S3 SDK** (if needed) - File storage

**Utilities:**
- **dotenv** - Environment variables
- **winston** - Logging
- **nodemailer** (future) - Email sending

**Development Tools:**
- **nodemon** - Development auto-reload
- **Jest** - Testing framework
- **Supertest** - API testing

---

### Database Technology

**Primary Database:**
- **PostgreSQL 15+** - Relational database
- **Shared Database** - Same database as LMS

**Database Tools:**
- **Sequelize CLI** - Migration management
- **pgAdmin / DBeaver** - Database administration

---

## Application Architecture

### Frontend Architecture

#### Folder Structure

```
dakshath-frontend/
├── public/
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── Modal.jsx
│   │   ├── job/
│   │   │   ├── JobCard.jsx
│   │   │   ├── JobList.jsx
│   │   │   ├── JobDetail.jsx
│   │   │   ├── JobFilters.jsx
│   │   │   └── QualificationBadge.jsx
│   │   ├── application/
│   │   │   ├── ApplicationCard.jsx
│   │   │   ├── ApplicationList.jsx
│   │   │   ├── ApplicationStatus.jsx
│   │   │   └── ApplicationForm.jsx
│   │   ├── profile/
│   │   │   ├── StudentProfile.jsx
│   │   │   ├── ScoreDisplay.jsx
│   │   │   └── AcademicHistory.jsx
│   │   └── company/
│   │       ├── CompanyCard.jsx
│   │       └── CompanyProfile.jsx
│   ├── pages/
│   │   ├── student/
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── JobSearchPage.jsx
│   │   │   ├── JobDetailPage.jsx
│   │   │   ├── ApplicationsPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── hr/
│   │   │   ├── HRDashboard.jsx
│   │   │   ├── CreateJobPage.jsx
│   │   │   ├── JobManagementPage.jsx
│   │   │   ├── ApplicationsPage.jsx
│   │   │   └── CompanyProfilePage.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CompanyApprovalPage.jsx
│   │   │   ├── UserManagementPage.jsx
│   │   │   └── AnalyticsPage.jsx
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── AuthCallbackPage.jsx
│   │   └── common/
│   │       ├── LandingPage.jsx
│   │       └── NotFoundPage.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── jobService.js
│   │   ├── applicationService.js
│   │   ├── studentService.js
│   │   └── companyService.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useJobs.js
│   │   ├── useApplications.js
│   │   └── useScore.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validation.js
│   │   └── formatters.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env.example
```

#### Component Architecture Patterns

**Container/Presentational Pattern:**
- **Container Components:** Handle data fetching and state
- **Presentational Components:** Pure UI components

**Custom Hooks:**
- Encapsulate reusable logic
- Separate concerns from components

**Context API:**
- Global state (authentication, theme)
- Avoid prop drilling

---

### Backend Architecture

#### Folder Structure

```
dakshath-backend/
├── config/
│   ├── database.js
│   ├── passport.js
│   └── constants.js
├── controllers/
│   ├── authController.js
│   ├── jobController.js
│   ├── applicationController.js
│   ├── studentController.js
│   ├── companyController.js
│   ├── hrController.js
│   └── adminController.js
├── models/
│   ├── Company.js
│   ├── JobListing.js
│   ├── Application.js
│   ├── HRUser.js
│   └── index.js
├── routes/
│   ├── index.js
│   ├── auth.js
│   ├── jobs.js
│   ├── applications.js
│   ├── students.js
│   ├── companies.js
│   ├── hr.js
│   └── admin.js
├── services/
│   ├── authService.js
│   ├── jobService.js
│   ├── applicationService.js
│   ├── scoreService.js
│   ├── matchingService.js
│   └── notificationService.js
├── middleware/
│   ├── auth.js
│   ├── roleCheck.js
│   ├── validation.js
│   ├── errorHandler.js
│   └── rateLimiter.js
├── utils/
│   ├── logger.js
│   ├── validators.js
│   ├── helpers.js
│   └── errors.js
├── migrations/
│   ├── 001-create-companies.js
│   ├── 002-create-hr-users.js
│   ├── 003-create-job-listings.js
│   ├── 004-create-applications.js
│   └── 005-create-student-scores.js
├── seeders/
│   └── seed-data.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── logs/
├── .env
├── .env.example
├── server.js
├── package.json
└── README.md
```

#### Layered Architecture

**1. Route Layer:**
- Define API endpoints
- Map routes to controllers
- Apply middleware

**2. Controller Layer:**
- Handle HTTP requests/responses
- Validate input
- Call service layer
- Format responses

**3. Service Layer:**
- Business logic
- Data processing
- External integrations
- Transaction management

**4. Model Layer:**
- Database models
- Data validation
- Relationships

**5. Middleware Layer:**
- Authentication
- Authorization
- Validation
- Error handling
- Logging

---

## Database Architecture

### Database Schema Design

#### Shared Tables (LMS - Read-Only Access)

**users**
- Primary key: `id`
- Used for: Authentication, user profiles
- Access: Read-only

**enrollments**
- Links: `student_id` → `users.id`, `course_id` → `courses.id`
- Used for: Student course history
- Access: Read-only

**test_attempts**
- Links: `student_id` → `users.id`, `test_id` → `course_tests.id`
- Used for: Student test scores
- Access: Read-only

**certificates**
- Links: `student_id` → `users.id`
- Used for: Student achievements
- Access: Read-only

**achievements**
- Links: `student_id` → `users.id`
- Used for: Student accomplishments
- Access: Read-only

**hackathon_participants**
- Links: `student_id` → `users.id`
- Used for: Hackathon participation and scores
- Access: Read-only

---

#### Dakshath-Specific Tables

**companies**
```sql
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    description TEXT,
    website VARCHAR(255),
    logo_url TEXT,
    industry VARCHAR(100),
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**hr_users**
```sql
CREATE TABLE hr_users (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'hr' CHECK (role IN ('hr', 'hr_manager')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, company_id)
);
```

**job_listings**
```sql
CREATE TABLE job_listings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    job_type VARCHAR(50) NOT NULL CHECK (job_type IN ('full-time', 'part-time', 'internship', 'contract')),
    location VARCHAR(255),
    department VARCHAR(100),
    required_score_min DECIMAL(5,2) NOT NULL CHECK (required_score_min >= 0 AND required_score_min <= 100),
    required_score_max DECIMAL(5,2) CHECK (required_score_max >= 0 AND required_score_max <= 100),
    skill_requirements JSONB,
    qualifications TEXT,
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    experience_level VARCHAR(50),
    application_deadline TIMESTAMP,
    number_of_positions INTEGER DEFAULT 1,
    posted_by INTEGER NOT NULL REFERENCES hr_users(id),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**applications**
```sql
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_listing_id INTEGER NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'applied' CHECK (status IN ('applied', 'under_review', 'interview_scheduled', 'accepted', 'rejected')),
    score_at_application DECIMAL(5,2) NOT NULL,
    cover_letter TEXT,
    notes TEXT,
    hr_notes TEXT,
    reviewed_by INTEGER REFERENCES hr_users(id),
    reviewed_at TIMESTAMP,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, job_listing_id)
);
```

**application_status_history**
```sql
CREATE TABLE application_status_history (
    id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    changed_by INTEGER REFERENCES users(id),
    notes TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**student_scores** (Future - when scoring system is implemented)
```sql
CREATE TABLE student_scores (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    overall_score DECIMAL(5,2) CHECK (overall_score >= 0 AND overall_score <= 100),
    course_average DECIMAL(5,2),
    test_average DECIMAL(5,2),
    project_average DECIMAL(5,2),
    hackathon_average DECIMAL(5,2),
    last_calculated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**job_categories**
```sql
CREATE TABLE job_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id INTEGER REFERENCES job_categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**notifications**
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### Database Indexes

**Performance Indexes:**
```sql
-- Companies
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_approved_by ON companies(approved_by);

-- HR Users
CREATE INDEX idx_hr_users_user_id ON hr_users(user_id);
CREATE INDEX idx_hr_users_company_id ON hr_users(company_id);

-- Job Listings
CREATE INDEX idx_job_listings_company_id ON job_listings(company_id);
CREATE INDEX idx_job_listings_status ON job_listings(status);
CREATE INDEX idx_job_listings_required_score_min ON job_listings(required_score_min);
CREATE INDEX idx_job_listings_job_type ON job_listings(job_type);
CREATE INDEX idx_job_listings_created_at ON job_listings(created_at DESC);

-- Applications
CREATE INDEX idx_applications_student_id ON applications(student_id);
CREATE INDEX idx_applications_job_listing_id ON applications(job_listing_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at DESC);

-- Student Scores
CREATE INDEX idx_student_scores_student_id ON student_scores(student_id);
CREATE INDEX idx_student_scores_overall_score ON student_scores(overall_score);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

**Composite Indexes:**
```sql
-- For common query patterns
CREATE INDEX idx_job_listings_company_status ON job_listings(company_id, status);
CREATE INDEX idx_applications_student_status ON applications(student_id, status);
CREATE INDEX idx_applications_job_status ON applications(job_listing_id, status);
```

---

### Database Relationships

**Entity Relationship Diagram (Key Relationships):**

```
users (LMS)
  ├── hr_users (1:N) - HR users linked to companies
  ├── applications (1:N) - Student applications
  └── student_scores (1:1) - Student scores

companies
  ├── hr_users (1:N) - HR users for company
  └── job_listings (1:N) - Job postings

job_listings
  └── applications (1:N) - Applications received

applications
  └── application_status_history (1:N) - Status changes

hr_users
  ├── job_listings (1:N) - Jobs posted by HR
  └── applications (1:N) - Applications reviewed
```

---

## API Architecture

### API Design Principles

1. **RESTful Design:** Follow REST conventions
2. **Resource-Based URLs:** Clear, intuitive endpoints
3. **HTTP Methods:** Proper use of GET, POST, PUT, DELETE
4. **Status Codes:** Appropriate HTTP status codes
5. **Versioning:** API versioning strategy
6. **Documentation:** Comprehensive API documentation

### API Endpoints

#### Authentication APIs

```
POST   /api/auth/login              - User login
POST   /api/auth/logout             - User logout
GET    /api/auth/me                 - Get current user
POST   /api/auth/refresh            - Refresh token
GET    /api/auth/google             - Google OAuth initiation
GET    /api/auth/google/callback    - Google OAuth callback
```

#### Student APIs

```
GET    /api/student/jobs                    - List all active jobs
GET    /api/student/jobs/:id                - Get job details
GET    /api/student/jobs/search             - Search jobs with filters
GET    /api/student/jobs/qualified          - Get jobs student qualifies for
POST   /api/student/applications            - Apply to job
GET    /api/student/applications             - Get student's applications
GET    /api/student/applications/:id         - Get application details
GET    /api/student/profile                  - Get own profile
GET    /api/student/score                    - Get current score
GET    /api/student/courses                  - Get course history
GET    /api/student/certificates             - Get certificates
GET    /api/student/notifications            - Get notifications
PUT    /api/student/notifications/:id/read    - Mark notification as read
```

#### HR APIs

```
GET    /api/hr/company                       - Get company profile
PUT    /api/hr/company                       - Update company profile
GET    /api/hr/jobs                          - Get company's job listings
POST   /api/hr/jobs                          - Create job listing
GET    /api/hr/jobs/:id                      - Get job details
PUT    /api/hr/jobs/:id                      - Update job listing
DELETE /api/hr/jobs/:id                      - Delete job listing
GET    /api/hr/jobs/:id/applications         - Get applications for job
GET    /api/hr/applications                  - Get all company applications
GET    /api/hr/applications/:id              - Get application details
PUT    /api/hr/applications/:id/status       - Update application status
GET    /api/hr/applications/:id/candidate    - Get candidate profile
GET    /api/hr/dashboard                     - Get HR dashboard stats
```

#### Admin APIs

```
GET    /api/admin/companies                  - List all companies
GET    /api/admin/companies/pending          - Get pending company requests
GET    /api/admin/companies/:id               - Get company details
POST   /api/admin/companies/:id/approve      - Approve company
POST   /api/admin/companies/:id/reject       - Reject company
PUT    /api/admin/companies/:id              - Update company
GET    /api/admin/users                      - List all users
POST   /api/admin/users                      - Create user
GET    /api/admin/users/:id                  - Get user details
PUT    /api/admin/users/:id                  - Update user
DELETE /api/admin/users/:id                  - Delete user
GET    /api/admin/jobs                       - List all jobs (oversight)
GET    /api/admin/applications                - List all applications
GET    /api/admin/dashboard                   - Get admin dashboard stats
GET    /api/admin/analytics                  - Get platform analytics
```

---

### API Request/Response Format

#### Standard Request Format

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Query Parameters:**
```
?page=1&limit=20&sort=created_at&order=desc
```

#### Standard Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "required_score_min",
        "message": "Minimum score is required"
      }
    ]
  }
}
```

#### HTTP Status Codes

- **200 OK:** Successful GET, PUT, PATCH
- **201 Created:** Successful POST
- **204 No Content:** Successful DELETE
- **400 Bad Request:** Validation error, malformed request
- **401 Unauthorized:** Authentication required
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource not found
- **409 Conflict:** Duplicate resource
- **422 Unprocessable Entity:** Business logic error
- **500 Internal Server Error:** Server error

---

## Integration Architecture

### LMS Integration

#### Database Integration

**Shared Database Access:**
- Same PostgreSQL instance
- Separate database users with appropriate permissions
- Read-only access to LMS tables

**Database User Permissions:**
```sql
-- Dakshath database user
CREATE USER dakshath_app WITH PASSWORD 'secure_password';

-- Grant read-only access to LMS tables
GRANT SELECT ON users TO dakshath_app;
GRANT SELECT ON enrollments TO dakshath_app;
GRANT SELECT ON test_attempts TO dakshath_app;
GRANT SELECT ON certificates TO dakshath_app;
GRANT SELECT ON achievements TO dakshath_app;
GRANT SELECT ON hackathon_participants TO dakshath_app;

-- Grant full access to Dakshath tables
GRANT ALL ON companies TO dakshath_app;
GRANT ALL ON hr_users TO dakshath_app;
GRANT ALL ON job_listings TO dakshath_app;
GRANT ALL ON applications TO dakshath_app;
-- ... etc
```

#### Authentication Integration

**Shared Authentication:**
- Same `users` table
- Google OAuth integration
- JWT token generation
- Session management

**Authentication Flow:**
1. User logs in via Google OAuth (LMS or Dakshath)
2. OAuth callback creates/updates user in `users` table
3. JWT token generated with user role
4. Token used for subsequent requests
5. Both applications can verify same token

---

### External Integrations

#### Google OAuth 2.0

**Integration Points:**
- User authentication
- User profile data (name, email, avatar)

**Flow:**
1. Redirect to Google OAuth
2. User authorizes
3. Google callback with code
4. Exchange code for tokens
5. Fetch user info
6. Create/update user in database
7. Generate JWT token

---

## Security Architecture

### Security Layers

#### 1. Network Security
- HTTPS/TLS encryption
- CORS configuration
- Rate limiting
- DDoS protection

#### 2. Application Security
- Input validation
- SQL injection prevention (ORM)
- XSS prevention
- CSRF protection
- Secure headers (Helmet.js)

#### 3. Authentication Security
- JWT token-based authentication
- Token expiration
- Refresh token mechanism
- Secure password hashing (if needed)

#### 4. Authorization Security
- Role-based access control (RBAC)
- Resource-level permissions
- API endpoint protection
- Data access restrictions

#### 5. Data Security
- Encryption at rest (database)
- Encryption in transit (HTTPS)
- Sensitive data masking
- Audit logging

---

### Security Best Practices

**Input Validation:**
- Validate all user inputs
- Sanitize data
- Use parameterized queries
- Type checking

**Error Handling:**
- Don't expose sensitive information
- Generic error messages for users
- Detailed logs for debugging (server-side only)

**Session Management:**
- Secure token storage
- Token expiration
- Logout functionality
- Session timeout

**API Security:**
- Rate limiting per user/IP
- Request size limits
- Timeout handling
- API key rotation (if applicable)

---

## Authentication & Authorization

### Authentication Flow

```
1. User clicks "Login"
   ↓
2. Redirect to Google OAuth
   ↓
3. User authorizes on Google
   ↓
4. Google redirects with code
   ↓
5. Backend exchanges code for tokens
   ↓
6. Fetch user info from Google
   ↓
7. Check if user exists in database
   ├─ Yes: Update last login
   └─ No: Create new user
   ↓
8. Generate JWT token with:
   - user_id
   - role (student/hr/admin)
   - company_id (if HR)
   ↓
9. Return token to frontend
   ↓
10. Frontend stores token
   ↓
11. Include token in subsequent requests
```

### Authorization Model

#### Role-Based Access Control (RBAC)

**Roles:**
1. **Student:** Can view jobs, apply, view own profile
2. **HR:** Can manage company jobs, view applications
3. **Admin:** Full platform access

**Permission Matrix:**

| Resource | Student | HR | Admin |
|----------|---------|----|----|
| View Jobs | ✅ | ✅ | ✅ |
| Apply to Jobs | ✅ (if qualified) | ❌ | ❌ |
| Create Jobs | ❌ | ✅ (own company) | ✅ |
| View Applications | ✅ (own) | ✅ (company's) | ✅ |
| Update Application Status | ❌ | ✅ (company's) | ✅ |
| Approve Companies | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |

#### Middleware Implementation

**Authentication Middleware:**
```javascript
// middleware/auth.js
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

**Authorization Middleware:**
```javascript
// middleware/roleCheck.js
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Usage
router.get('/admin/users', authenticate, requireRole('admin'), getUsers);
```

**Resource-Level Authorization:**
```javascript
// Check if HR user belongs to company
const checkCompanyAccess = async (req, res, next) => {
  if (req.user.role === 'admin') {
    return next(); // Admin has access to all
  }
  
  if (req.user.role === 'hr') {
    const job = await JobListing.findByPk(req.params.id);
    if (job.company_id !== req.user.company_id) {
      return res.status(403).json({ error: 'Access denied' });
    }
  }
  
  next();
};
```

---

## Data Flow Architecture

### Student Application Flow

```
┌─────────┐      ┌──────────┐      ┌─────────┐      ┌──────────┐
│ Student │      │ Frontend │      │ Backend │      │Database  │
│ Browser │      │  (React) │      │(Express)│      │(Postgres)│
└────┬────┘      └────┬─────┘      └────┬────┘      └────┬─────┘
     │                 │                 │                 │
     │ 1. View Job     │                 │                 │
     │────────────────>│                 │                 │
     │                 │ 2. GET /jobs/:id│                 │
     │                 │─────────────────>│                 │
     │                 │                 │ 3. Query DB     │
     │                 │                 │────────────────>│
     │                 │                 │ 4. Return job   │
     │                 │                 │<────────────────│
     │                 │ 5. Job data     │                 │
     │                 │<─────────────────│                 │
     │ 6. Display job   │                 │                 │
     │<────────────────│                 │                 │
     │                 │                 │                 │
     │ 7. Click Apply  │                 │                 │
     │────────────────>│                 │                 │
     │                 │ 8. Get score    │                 │
     │                 │─────────────────>│                 │
     │                 │                 │ 9. Query score  │
     │                 │                 │────────────────>│
     │                 │                 │ 10. Return score│
     │                 │                 │<────────────────│
     │                 │ 11. Validate    │                 │
     │                 │    score >= req │                 │
     │                 │                 │                 │
     │                 │ 12. POST /applications            │
     │                 │─────────────────>│                 │
     │                 │                 │ 13. Validate    │
     │                 │                 │    score again  │
     │                 │                 │────────────────>│
     │                 │                 │ 14. Create app  │
     │                 │                 │────────────────>│
     │                 │                 │ 15. Success     │
     │                 │                 │<────────────────│
     │                 │ 16. Success     │                 │
     │                 │<─────────────────│                 │
     │ 17. Confirmation│                 │                 │
     │<────────────────│                 │                 │
```

### Score Validation Flow

```
┌─────────┐      ┌──────────┐      ┌─────────┐      ┌──────────┐
│ Student │      │ Frontend │      │ Backend │      │Database  │
│ Browser │      │  (React) │      │(Express)│      │(Postgres)│
└────┬────┘      └────┬─────┘      └────┬────┘      └────┬─────┘
     │                 │                 │                 │
     │ 1. View Job     │                 │                 │
     │────────────────>│                 │                 │
     │                 │ 2. GET /jobs/:id│                 │
     │                 │─────────────────>│                 │
     │                 │                 │ 3. Get job      │
     │                 │                 │────────────────>│
     │                 │                 │ 4. Job data     │
     │                 │                 │<────────────────│
     │                 │ 5. GET /student/score             │
     │                 │─────────────────>│                 │
     │                 │                 │ 6. Calculate/Get │
     │                 │                 │    student score│
     │                 │                 │────────────────>│
     │                 │                 │ 7. Score data   │
     │                 │                 │<────────────────│
     │                 │ 8. Compare scores                │
     │                 │    (score >= required?)          │
     │                 │                 │                 │
     │                 │ 9. Return job + qualification     │
     │                 │<─────────────────│                 │
     │ 10. Display     │                 │                 │
     │     qualification status                           │
     │<────────────────│                 │                 │
```

---

## Deployment Architecture

### Deployment Environment

#### Development Environment
- Local development
- Hot reload enabled
- Debug mode
- Development database

#### Staging Environment
- Production-like setup
- Testing environment
- Staging database
- Pre-production validation

#### Production Environment
- Optimized builds
- Production database
- Monitoring and logging
- High availability

---

### Deployment Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer / CDN                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼────────┐          ┌─────────▼────────┐
│  Frontend      │          │  Frontend        │
│  Server 1      │          │  Server 2        │
│  (Static Files)│          │  (Static Files)  │
└───────┬────────┘          └─────────┬────────┘
        │                             │
        └──────────────┬──────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼────────┐          ┌─────────▼────────┐
│  Backend       │          │  Backend         │
│  Server 1      │          │  Server 2        │
│  (Node.js)     │          │  (Node.js)       │
└───────┬────────┘          └─────────┬────────┘
        │                             │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │    PostgreSQL Database      │
        │    (Primary + Replica)      │
        └─────────────────────────────┘
```

---

### Infrastructure Components

#### Frontend Deployment
- **Static Hosting:** Vercel, Netlify, or AWS S3 + CloudFront
- **Build:** Production build with Vite
- **CDN:** Content delivery network for assets
- **Environment Variables:** Secure configuration

#### Backend Deployment
- **Hosting:** AWS EC2, Heroku, or DigitalOcean
- **Process Manager:** PM2 for Node.js
- **Reverse Proxy:** Nginx
- **SSL/TLS:** Let's Encrypt certificates

#### Database Deployment
- **Hosting:** AWS RDS, DigitalOcean Managed Database
- **Backup:** Automated daily backups
- **Replication:** Read replicas for scaling
- **Monitoring:** Database performance monitoring

---

## Scalability & Performance

### Performance Optimization

#### Frontend Optimization
- **Code Splitting:** Lazy load routes and components
- **Bundle Optimization:** Tree shaking, minification
- **Image Optimization:** WebP format, lazy loading
- **Caching:** Browser caching, service workers
- **CDN:** Static asset delivery

#### Backend Optimization
- **Database Indexing:** Proper indexes on frequently queried columns
- **Query Optimization:** Efficient queries, avoid N+1 problems
- **Caching:** Redis for frequently accessed data
- **Connection Pooling:** Database connection pooling
- **Compression:** Gzip compression for responses

#### Database Optimization
- **Indexes:** Strategic indexes for common queries
- **Query Optimization:** Analyze slow queries
- **Partitioning:** Table partitioning for large tables
- **Connection Pooling:** Efficient connection management

---

### Scalability Strategies

#### Horizontal Scaling
- Multiple backend instances
- Load balancing
- Database read replicas
- Stateless application design

#### Vertical Scaling
- Increase server resources
- Database optimization
- Caching layers

#### Caching Strategy
- **Redis Cache:**
  - Student scores
  - Job listings (with TTL)
  - Company profiles
  - Frequently accessed data

- **Browser Cache:**
  - Static assets
  - API responses (where appropriate)

---

## Error Handling & Logging

### Error Handling Strategy

#### Error Types
1. **Validation Errors:** 400 Bad Request
2. **Authentication Errors:** 401 Unauthorized
3. **Authorization Errors:** 403 Forbidden
4. **Not Found Errors:** 404 Not Found
5. **Business Logic Errors:** 422 Unprocessable Entity
6. **Server Errors:** 500 Internal Server Error

#### Error Handling Middleware
```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        details: err.details
      }
    });
  }
  
  // Authentication errors
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      }
    });
  }
  
  // Default server error
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message
    }
  });
};
```

---

### Logging Strategy

#### Logging Levels
- **Error:** Critical errors requiring attention
- **Warn:** Warning messages
- **Info:** General information
- **Debug:** Debug information (development only)

#### Logging Implementation
```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = logger;
```

#### Logging Best Practices
- Log all errors with context
- Log important business events
- Don't log sensitive information
- Structured logging (JSON format)
- Log rotation and retention

---

## Testing Strategy

### Testing Pyramid

```
        ┌─────────┐
        │   E2E   │  (Few)
        │  Tests  │
        ├─────────┤
        │Integration│  (Some)
        │  Tests   │
        ├─────────┤
        │   Unit  │  (Many)
        │  Tests  │
        └─────────┘
```

### Unit Testing
- **Framework:** Jest
- **Coverage:** Services, utilities, helpers
- **Target:** 80%+ code coverage

### Integration Testing
- **Framework:** Jest + Supertest
- **Coverage:** API endpoints, database operations
- **Database:** Test database with transactions

### End-to-End Testing
- **Framework:** Cypress or Playwright
- **Coverage:** Critical user flows
- **Scenarios:**
  - Student application flow
  - HR job posting flow
  - Admin company approval flow

### Testing Best Practices
- Write tests before/alongside code
- Test edge cases and error scenarios
- Mock external dependencies
- Use test fixtures for data
- Clean up test data

---

## Summary

### Architecture Highlights

1. **Modular Design:** Clear separation of concerns
2. **Scalable:** Horizontal and vertical scaling support
3. **Secure:** Multi-layer security approach
4. **Maintainable:** Clean code structure and documentation
5. **Performant:** Optimization strategies at all layers
6. **Reliable:** Error handling and logging

### Key Technical Decisions

- **Shared Database:** Real-time data access, no sync needed
- **RESTful API:** Standard, predictable API design
- **JWT Authentication:** Stateless, scalable authentication
- **Role-Based Access:** Flexible authorization model
- **Component-Based Frontend:** Reusable, maintainable UI

### Next Steps

1. Set up development environment
2. Create database schema and migrations
3. Implement authentication system
4. Build core API endpoints
5. Develop frontend components
6. Integration testing
7. Performance optimization
8. Security audit
9. Deployment preparation

---

**Document Status:** Complete Architecture Design  
**Last Updated:** November 2025  
**Purpose:** Technical architecture specification for Dakshath platform

---

_This document provides comprehensive technical architecture guidelines for building a scalable, secure, and maintainable Dakshath platform. All development should follow these architectural patterns and principles._

