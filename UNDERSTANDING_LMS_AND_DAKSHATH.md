# Understanding: LMS and Dakshath Integration

**Document Version:** 1.0  
**Date:** November 2025  
**Project:** Dakshath - Job/Internship Platform Integration with LMS  
**Prepared by:** Development Team

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [LMS Application Overview](#lms-application-overview)
3. [Dakshath Application Overview](#dakshath-application-overview)
4. [Integration Architecture](#integration-architecture)
5. [Database Structure & Shared Resources](#database-structure--shared-resources)
6. [Scoring System (Future Implementation)](#scoring-system-future-implementation)
7. [Technical Architecture](#technical-architecture)
8. [Key Features & Functionality](#key-features--functionality)
9. [Data Flow & Interconnections](#data-flow--interconnections)
10. [Implementation Considerations](#implementation-considerations)

---

## Executive Summary

### Project Overview

**Dakshath** is a job and internship searching platform designed to help students discover career opportunities based on their academic performance and scores from the Learning Management System (LMS). The platform will be integrated with the existing LMS application, sharing the same database infrastructure while maintaining separate application logic and user interfaces.

### Key Objectives

1. **Student Career Development:** Enable students to find jobs and internships matching their skill levels and academic achievements
2. **Score-Based Matching:** Match students with opportunities based on their LMS performance scores (to be implemented)
3. **Seamless Integration:** Leverage existing LMS user data and authentication system
4. **Unified Database:** Share database infrastructure for efficient data management and consistency
5. **Independent Application:** Maintain separate application codebase while sharing core resources

### Business Value

- **For Students:** Easy access to career opportunities aligned with their academic performance
- **For Employers:** Access to qualified candidates with verified academic credentials
- **For LMS Platform:** Enhanced value proposition by connecting learning to career opportunities
- **For Administrators:** Centralized management of both learning and career services

---

## LMS Application Overview

### Current LMS Architecture

The LMS (Learning Management System) is a comprehensive educational platform built with:

**Technology Stack:**
- **Frontend:** React.js with Vite
- **Backend:** Node.js with Express.js
- **Database:** PostgreSQL
- **Authentication:** Google OAuth 2.0

### Core LMS Features

1. **User Management**
   - Admin and Student roles
   - Google OAuth authentication
   - User profiles and permissions

2. **Course Management**
   - Course creation and editing
   - Chapter-based content structure
   - Video embedding and document uploads (PDF, DOCX)
   - Course publishing/unpublishing

3. **Enrollment System**
   - Student course enrollment
   - Progress tracking (0-100%)
   - Course completion status
   - Enrollment history

4. **Testing & Assessment**
   - Course tests/quizzes
   - Test attempts with scoring
   - Question-answer tracking
   - Passing score validation

5. **Projects & Hackathons**
   - Realtime projects with phases
   - Hackathon management
   - Project submissions and scoring
   - Group collaboration

6. **Certificates & Achievements**
   - Certificate generation
   - Achievement tracking
   - Activity logging

### LMS Database Schema (Key Tables)

**Core Tables:**
- `users` - User accounts (admin/student roles)
- `courses` - Course catalog
- `enrollments` - Student-course relationships
- `course_chapters` - Course content structure
- `chapter_progress` - Student progress tracking

**Assessment Tables:**
- `course_tests` - Tests/quizzes
- `test_questions` - Test questions
- `test_question_options` - Answer choices
- `test_attempts` - Student test submissions (with `score` field)
- `test_answers` - Individual answers with points

**Project Tables:**
- `projects` - Realtime projects
- `project_phases` - Project milestones
- `project_progress` - Student project work
- `hackathons` - Hackathon events
- `hackathon_participants` - Participant records (with `score` field)
- `hackathon_submissions` - Project submissions (with `score` field)

**Other Tables:**
- `certificates` - Earned certificates
- `achievements` - Student achievements
- `activity_logs` - User activity tracking
- `file_uploads` - Uploaded course materials

### Current Scoring Data Available

The LMS already captures scoring data in several areas:

1. **Test Scores** (`test_attempts` table):
   - `score` (DECIMAL 5,2) - Percentage score (0-100)
   - `earned_points` - Points earned
   - `total_points` - Total possible points
   - `passed` - Boolean indicating if passing score was met

2. **Hackathon Scores** (`hackathon_participants` and `hackathon_submissions`):
   - `score` (0-100) - Scores given by judges/reviewers

3. **Course Progress** (`enrollments` table):
   - `progress` (0-100%) - Course completion percentage
   - `status` - Enrollment status (enrolled, completed, dropped)

4. **Course Ratings** (`enrollments` table):
   - `rating` (1-5) - Student course ratings
   - `review` - Text reviews

**Note:** While scoring data exists, a comprehensive "student score" or "overall performance score" system is not yet implemented. This will be developed in the future to aggregate scores across courses, tests, projects, and hackathons.

---

## Dakshath Application Overview

### Application Purpose

Dakshath is a job and internship discovery platform that:

1. **Connects Students with Opportunities:** Helps students find jobs and internships based on their academic performance
2. **Score-Based Matching:** Matches students with opportunities using their LMS scores (when scoring system is implemented)
3. **Career Development:** Provides a platform for students to explore career paths aligned with their learning achievements
4. **Employer Access:** Allows employers to post opportunities and find qualified candidates

### Core Features (Planned)

1. **Job/Internship Listings**
   - Browse available positions
   - Search and filter opportunities
   - View detailed job descriptions
   - Application requirements and qualifications

2. **Student Profile Integration**
   - Display student academic performance
   - Show course completions
   - Display test scores and achievements
   - Show certificates and hackathon participation

3. **Score-Based Matching** (Future)
   - Match students with opportunities based on:
     - Overall academic score (aggregated from LMS)
     - Course completion rates
     - Test performance
     - Project and hackathon scores
     - Skill-based matching

4. **Application Management**
   - Apply to jobs/internships
   - Track application status
   - View application history
   - Receive notifications

5. **Employer Portal** (Potential)
   - Post job/internship listings
   - View candidate profiles
   - Filter candidates by scores/qualifications
   - Manage applications

6. **Search & Discovery**
   - Search by keywords
   - Filter by:
     - Job type (full-time, part-time, internship)
     - Industry/sector
     - Required score range
     - Location
     - Experience level

### User Roles (Planned)

1. **Student** - Primary users who search and apply for opportunities
2. **Employer** - Companies posting opportunities (potential future role)
3. **Admin** - Platform administrators managing listings and users

---

## Integration Architecture

### Shared Database Approach

Both LMS and Dakshath will share the same PostgreSQL database, ensuring:

1. **Data Consistency:** Single source of truth for user data
2. **Real-time Updates:** Changes in LMS immediately available in Dakshath
3. **Unified Authentication:** Same user accounts for both platforms
4. **Efficient Data Access:** No need for API synchronization between separate databases

### Application Separation

While sharing the database, the applications remain separate:

```
LMS_Project/
├── frontend/          # LMS Frontend (React)
├── backend/           # LMS Backend (Node.js/Express)
└── Dakshath/          # Dakshath Application (Separate folder)
    ├── frontend/      # Dakshath Frontend (React)
    ├── backend/       # Dakshath Backend (Node.js/Express)
    └── ...
```

### Integration Points

1. **User Authentication**
   - Shared user table (`users`)
   - Same Google OAuth system
   - Unified session management (or separate sessions with shared auth)

2. **Student Data Access**
   - Read access to student profiles
   - Read access to enrollments
   - Read access to test attempts and scores
   - Read access to project/hackathon data
   - Read access to certificates and achievements

3. **Score Calculation** (Future)
   - Aggregate scoring system will calculate overall student performance
   - Scores stored in shared database
   - Accessible by both LMS and Dakshath

4. **Data Synchronization**
   - Real-time access (no sync needed - same database)
   - Event-driven updates if needed (via database triggers or application events)

---

## Database Structure & Shared Resources

### Shared Tables (Read/Write by Both Applications)

1. **`users`** - User accounts
   - Used by: LMS (authentication, profiles), Dakshath (student profiles, authentication)

2. **`enrollments`** - Course enrollments
   - Used by: LMS (enrollment management), Dakshath (display student course history)

3. **`test_attempts`** - Test scores
   - Used by: LMS (test taking), Dakshath (display academic performance)

4. **`certificates`** - Earned certificates
   - Used by: LMS (certificate generation), Dakshath (display student achievements)

5. **`achievements`** - Student achievements
   - Used by: LMS (achievement tracking), Dakshath (display accomplishments)

6. **`hackathon_participants`** - Hackathon participation
   - Used by: LMS (hackathon management), Dakshath (display participation history)

### Dakshath-Specific Tables (To Be Created)

1. **`job_listings`** - Job and internship postings
   - Fields: id, title, description, company, job_type, location, required_score_min, required_score_max, requirements, posted_by, status, created_at, updated_at

2. **`internship_listings`** - Internship-specific postings (or combined with job_listings)
   - Similar structure to job_listings

3. **`applications`** - Student applications to jobs/internships
   - Fields: id, student_id, listing_id, status, applied_at, notes, score_at_application

4. **`employers`** - Employer/company profiles (if employer portal is implemented)
   - Fields: id, company_name, email, description, logo_url, created_at

5. **`student_scores`** - Aggregated student performance scores (Future)
   - Fields: id, student_id, overall_score, course_average, test_average, project_average, hackathon_average, last_calculated_at
   - This table will be populated by the scoring system when implemented

6. **`job_categories`** - Categories for job listings
   - Fields: id, name, description, parent_id

7. **`application_status_history`** - Track application status changes
   - Fields: id, application_id, status, changed_at, changed_by, notes

### Database Access Strategy

**LMS Backend:**
- Full read/write access to LMS-specific tables
- Read-only access to shared user data
- No direct access to Dakshath-specific tables (maintain separation)

**Dakshath Backend:**
- Full read/write access to Dakshath-specific tables
- Read-only access to LMS student data (enrollments, scores, achievements)
- Read-only access to user authentication data

**Shared Services:**
- Authentication service (can be shared or separate with shared user table)
- User profile service (shared read access)

---

## Scoring System (Future Implementation)

### Current State

The LMS currently tracks scores in various contexts:
- Individual test scores (`test_attempts.score`)
- Hackathon scores (`hackathon_participants.score`, `hackathon_submissions.score`)
- Course progress (`enrollments.progress`)
- Course ratings (`enrollments.rating`)

However, there is **no aggregated student score** system yet.

### Future Scoring System Design

When implemented, the scoring system should:

1. **Calculate Overall Student Score**
   - Aggregate scores from:
     - Test attempts (weighted average)
     - Course completion rates
     - Project scores
     - Hackathon performance
     - Certificates earned (bonus points)

2. **Score Components** (Proposed)
   - **Academic Score (70%):**
     - Test scores average
     - Course completion rate
     - Course ratings (if applicable)
   
   - **Project Score (20%):**
     - Realtime project completion
     - Project phase completion
     - Project quality scores
   
   - **Hackathon Score (10%):**
     - Hackathon participation
     - Hackathon scores
     - Awards/recognition

3. **Score Storage**
   - Store in `student_scores` table
   - Update periodically (daily/weekly)
   - Cache for performance

4. **Score Usage in Dakshath**
   - Filter jobs by required minimum score
   - Display student score on profile
   - Match students with appropriate opportunities
   - Show score trends over time

### Implementation Notes

- Scoring system will be implemented in LMS backend
- Scores will be stored in shared database
- Dakshath will read scores for matching and display
- Score calculation can be triggered:
  - On-demand (when student views profile)
  - Scheduled (daily/weekly batch job)
  - Event-driven (when new test/project completed)

---

## Technical Architecture

### Dakshath Application Structure

```
Dakshath/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── job/
│   │   │   │   ├── JobCard.jsx
│   │   │   │   ├── JobList.jsx
│   │   │   │   ├── JobDetail.jsx
│   │   │   │   └── JobFilters.jsx
│   │   │   ├── application/
│   │   │   │   ├── ApplicationCard.jsx
│   │   │   │   ├── ApplicationList.jsx
│   │   │   │   └── ApplicationStatus.jsx
│   │   │   ├── profile/
│   │   │   │   ├── StudentProfile.jsx
│   │   │   │   ├── ScoreDisplay.jsx
│   │   │   │   └── AcademicHistory.jsx
│   │   │   └── common/
│   │   │       ├── Header.jsx
│   │   │       ├── Footer.jsx
│   │   │       └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── JobSearchPage.jsx
│   │   │   ├── JobDetailPage.jsx
│   │   │   ├── ApplicationPage.jsx
│   │   │   ├── StudentProfilePage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── jobService.js
│   │   │   ├── applicationService.js
│   │   │   └── studentService.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── utils/
│   │       └── helpers.js
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   ├── studentController.js
│   │   └── scoreController.js
│   ├── models/
│   │   ├── JobListing.js
│   │   ├── Application.js
│   │   ├── Employer.js
│   │   └── StudentScore.js
│   ├── routes/
│   │   ├── jobs.js
│   │   ├── applications.js
│   │   └── students.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── services/
│   │   ├── jobService.js
│   │   ├── matchingService.js
│   │   └── scoreService.js
│   ├── config/
│   │   └── database.js (shared database connection)
│   ├── migrations/
│   │   ├── 001-create-job-listings.js
│   │   ├── 002-create-applications.js
│   │   └── 003-create-student-scores.js
│   └── server.js
│
└── README.md
```

### Technology Stack (Proposed)

**Frontend:**
- React.js (consistent with LMS)
- Vite (build tool)
- React Router (routing)
- Axios (API calls)
- Tailwind CSS (styling, consistent with LMS)

**Backend:**
- Node.js with Express.js (consistent with LMS)
- Sequelize ORM (for database access)
- PostgreSQL (shared database)
- JWT authentication (or shared session management)

**Shared Resources:**
- PostgreSQL database
- User authentication system (Google OAuth)
- AWS S3 (if needed for document storage)

---

## Key Features & Functionality

### 1. Job/Internship Search & Discovery

**Features:**
- Browse all available opportunities
- Search by keywords (job title, company, description)
- Filter by:
  - Job type (Full-time, Part-time, Internship, Contract)
  - Industry/Category
  - Location
  - Required minimum score (when scoring system is implemented)
  - Salary range (if applicable)
  - Experience level
- Sort by: Relevance, Date posted, Score requirement

**User Flow:**
1. Student logs into Dakshath
2. Views job listings page
3. Applies filters/search
4. Views job details
5. Applies to job (if qualified)

### 2. Student Profile & Academic Display

**Features:**
- Display student information from LMS
- Show academic performance:
  - Enrolled courses
  - Course completion rates
  - Test scores (when available)
  - Certificates earned
  - Hackathon participation
  - Overall score (when scoring system is implemented)
- Academic history timeline
- Skills and achievements

**Data Sources (from LMS):**
- `users` table - Basic profile
- `enrollments` table - Course history and progress
- `test_attempts` table - Test scores
- `certificates` table - Certificates earned
- `achievements` table - Achievements unlocked
- `hackathon_participants` table - Hackathon participation
- `student_scores` table - Overall score (future)

### 3. Application Management

**Features:**
- Apply to jobs/internships
- Track application status:
  - Applied
  - Under Review
  - Interview Scheduled
  - Accepted
  - Rejected
- View application history
- Receive status update notifications
- View application details and notes

**Application Process:**
1. Student views job listing
2. Checks if they meet requirements (score, qualifications)
3. Submits application
4. Application stored in `applications` table
5. Student can track status
6. Employer (if implemented) can review and update status

### 4. Score-Based Matching (Future)

**Features:**
- Match students with opportunities based on:
  - Overall academic score
  - Specific course/test scores
  - Skill requirements
  - Experience level
- Display "Recommended for you" section
- Show why a job matches (score requirement met)
- Filter jobs by "I qualify" vs "All jobs"

**Matching Logic (Proposed):**
- If job requires minimum score X, show only to students with score >= X
- Weighted matching based on:
  - Score match (40%)
  - Course relevance (30%)
  - Skills match (20%)
  - Experience level (10%)

### 5. Employer Portal (Potential Future Feature)

**Features:**
- Post job/internship listings
- View candidate applications
- Filter candidates by:
  - Score range
  - Course completions
  - Certificates
  - Skills
- Manage application status
- Send messages to candidates

---

## Data Flow & Interconnections

### Authentication Flow

```
1. User logs in via Google OAuth (LMS or Dakshath)
2. Authentication handled by shared user table
3. JWT token generated (or session created)
4. User redirected to appropriate dashboard:
   - LMS dashboard (if accessed via LMS)
   - Dakshath dashboard (if accessed via Dakshath)
5. Both applications can verify user identity using shared auth
```

### Student Data Access Flow

```
Dakshath Frontend
    ↓
Dakshath Backend API
    ↓
PostgreSQL Database (Read-only access)
    ├── users (read student profile)
    ├── enrollments (read course history)
    ├── test_attempts (read test scores)
    ├── certificates (read certificates)
    ├── achievements (read achievements)
    └── student_scores (read overall score - future)
    ↓
Data formatted and returned to frontend
    ↓
Displayed in Dakshath UI
```

### Job Application Flow

```
1. Student views job listing in Dakshath
2. Student clicks "Apply"
3. Dakshath backend:
   - Retrieves student's current score (from LMS data)
   - Checks if student meets requirements
   - Creates application record in `applications` table
   - Stores score_at_application (snapshot)
4. Application status tracked in Dakshath
5. Updates can be viewed by student
```

### Score Calculation Flow (Future)

```
LMS Backend (Score Calculation Service)
    ↓
Reads from LMS tables:
    ├── test_attempts (test scores)
    ├── enrollments (course progress)
    ├── projects (project scores)
    └── hackathons (hackathon scores)
    ↓
Calculates aggregated score
    ↓
Stores in student_scores table
    ↓
Dakshath reads from student_scores
    ↓
Uses for job matching and display
```

---

## Implementation Considerations

### 1. Database Access Control

**Challenge:** Ensure Dakshath doesn't accidentally modify LMS data

**Solution:**
- Use database views for read-only access
- Implement strict access control in backend
- Use separate database users with appropriate permissions
- Add validation to prevent unauthorized writes

### 2. Authentication Strategy

**Options:**
- **Option A:** Shared authentication service
  - Single auth endpoint used by both apps
  - Shared JWT tokens
  - Pros: Simpler, unified experience
  - Cons: Tight coupling

- **Option B:** Separate authentication with shared user table
  - Each app has its own auth endpoints
  - Both read from same `users` table
  - Pros: Better separation, independent scaling
  - Cons: More complex, need to sync auth state

**Recommendation:** Option B for better separation of concerns

### 3. Score System Implementation Timeline

**Phase 1 (Current):** 
- Build Dakshath without score-based matching
- Display available student data (test scores, enrollments)
- Basic job search and application

**Phase 2 (Future):**
- Implement scoring system in LMS
- Create `student_scores` table
- Calculate and store aggregated scores
- Integrate score display in Dakshath

**Phase 3 (Future):**
- Implement score-based matching
- Add score filters to job search
- Show "Recommended for you" based on scores

### 4. Data Synchronization

**Since both apps use the same database:**
- No API synchronization needed
- Real-time data access
- Changes in LMS immediately visible in Dakshath
- Consider caching for performance (Redis if needed)

### 5. API Design

**Dakshath Backend APIs:**

```
GET  /api/jobs                    - List all jobs
GET  /api/jobs/:id                - Get job details
GET  /api/jobs/search             - Search jobs with filters
POST /api/applications            - Apply to job
GET  /api/applications            - Get student's applications
GET  /api/applications/:id        - Get application details
GET  /api/students/:id/profile    - Get student profile (from LMS data)
GET  /api/students/:id/scores     - Get student scores (future)
GET  /api/students/:id/courses    - Get student course history
GET  /api/students/:id/certificates - Get student certificates
```

**LMS Data Access (Read-only):**
- Dakshath backend reads directly from database
- No need for LMS API calls (unless preferred for abstraction)

### 6. Error Handling

- Handle cases where student data doesn't exist
- Handle missing scores gracefully (before scoring system is implemented)
- Provide fallback UI when data is unavailable
- Log errors for debugging

### 7. Performance Considerations

- Index database tables for common queries
- Cache frequently accessed data (student profiles, job listings)
- Paginate job listings
- Optimize queries for student data aggregation
- Use database views for complex queries

### 8. Security Considerations

- Ensure Dakshath can only read LMS student data (not modify)
- Implement proper authentication and authorization
- Validate user permissions before showing data
- Sanitize inputs to prevent SQL injection
- Use parameterized queries
- Implement rate limiting

### 9. Testing Strategy

- Unit tests for business logic
- Integration tests for database access
- API tests for endpoints
- Test data isolation (use test database)
- Test score calculation (when implemented)
- Test matching algorithms (when implemented)

---

## Summary

### Key Points

1. **LMS** is a comprehensive learning management system with courses, tests, projects, and hackathons
2. **Dakshath** is a job/internship platform that will help students find opportunities based on their LMS performance
3. **Shared Database** approach ensures data consistency and real-time access
4. **Scoring System** is not yet implemented but will be crucial for Dakshath's matching functionality
5. **Separate Applications** maintain code independence while sharing infrastructure
6. **Future Integration** will include score-based matching when scoring system is implemented

### Next Steps

1. **Immediate:**
   - Set up Dakshath folder structure
   - Create database schema for Dakshath-specific tables
   - Build basic job listing functionality
   - Implement student profile display (using existing LMS data)

2. **Short-term:**
   - Build job search and filtering
   - Implement application management
   - Create student dashboard in Dakshath
   - Test database access and data retrieval

3. **Future (When Scoring System is Ready):**
   - Integrate score-based matching
   - Add score filters to job search
   - Implement recommendation engine
   - Display score trends and analytics

---

**Document Status:** Initial Understanding Document  
**Last Updated:** November 2025  
**Next Review:** After scoring system implementation planning

---

_This document represents the current understanding of the LMS and Dakshath integration. It should be updated as the project evolves and requirements become clearer._

