# Dakshath - Complete Functionality Overview

**Document Version:** 1.0  
**Date:** November 2025  
**Project:** Dakshath - Job/Internship Platform  
**Document Type:** Functional Requirements & Feature Specification

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [User Roles & Access](#user-roles--access)
4. [Student Portal Functionality](#student-portal-functionality)
5. [HR Portal Functionality](#hr-portal-functionality)
6. [Admin Portal Functionality](#admin-portal-functionality)
7. [Core Business Rules](#core-business-rules)
8. [User Flows & Workflows](#user-flows--workflows)
9. [Feature Details](#feature-details)
10. [Integration with LMS](#integration-with-lms)
11. [Scoring System Requirements](#scoring-system-requirements)

---

## Executive Summary

### What is Dakshath?

Dakshath is a job and internship discovery platform that connects students with career opportunities from collaborating companies. The platform ensures that students can only apply to positions where their academic performance (LMS scores) meets or exceeds the minimum requirements set by employers.

### Key Value Propositions

- **For Students:** Discover and apply to job opportunities matched to their academic achievements
- **For Companies/HR:** Post job openings and receive applications only from qualified candidates
- **For Administrators:** Manage the platform, approve company collaborations, and oversee operations

### Core Principle

**Score-Based Application System:** Students can only apply to jobs if their LMS score is equal to or greater than the minimum score requirement set by the employer/HR for that specific position.

---

## System Overview

### Platform Purpose

Dakshath serves as a bridge between:
- **Learning Management System (LMS)** - Where students' academic performance is tracked
- **Collaborating Companies** - Organizations posting job and internship opportunities
- **Students** - Learners seeking career opportunities based on their academic achievements

### System Components

1. **Student Portal** - Where students browse jobs, view their scores, and apply to positions
2. **HR Portal** - Where company representatives post jobs, set requirements, and manage applications
3. **Admin Portal** - Where platform administrators manage companies, users, and system operations
4. **LMS Integration** - Connection to LMS for student academic data and scores

### Key Relationships

- **Companies** collaborate with Dakshath to post opportunities
- **HR Users** represent companies and manage job postings
- **Students** from LMS can access Dakshath to find opportunities
- **Administrators** oversee the entire platform

---

## User Roles & Access

### 1. Student Role

**Who:** Learners enrolled in the LMS system

**Primary Purpose:** Search for jobs/internships and apply to qualified positions

**Key Capabilities:**
- View all available job listings from collaborating companies
- Search and filter job opportunities
- View detailed job descriptions and requirements
- See their current LMS score and academic profile
- Apply to jobs (only if score requirement is met)
- Track application status
- View application history

**Access Restrictions:**
- Cannot create or modify job listings
- Cannot view other students' profiles
- Cannot modify their own scores (scores come from LMS)
- Can only apply to jobs they qualify for (score-based restriction)

---

### 2. HR Role (Employer/Company Representative)

**Who:** Representatives from companies collaborating with Dakshath

**Primary Purpose:** Post job opportunities, set requirements, and manage candidate applications

**Key Capabilities:**
- Manage company profile
- Create job and internship listings
- Set minimum score requirements for each position
- View applications for their company's job postings
- Review candidate profiles and academic history
- Filter and search candidates
- Update application status
- Manage multiple job postings

**Access Restrictions:**
- Can only manage jobs for their own company
- Cannot view applications for other companies' jobs
- Cannot modify student scores
- Cannot approve/reject company collaborations (Admin function)
- Cannot create other HR users (Admin function)

---

### 3. Admin Role

**Who:** Platform administrators managing Dakshath operations

**Primary Purpose:** Oversee platform, manage companies, and ensure system integrity

**Key Capabilities:**
- Approve or reject company collaboration requests
- Manage all user accounts (Students, HR, Admin)
- View and manage all company profiles
- Oversee all job listings across the platform
- View platform-wide analytics and statistics
- Manage system configuration
- Handle support requests and disputes
- Monitor application activity
- Configure scoring system parameters

**Access Restrictions:**
- No restrictions (full platform access)
- Can override certain restrictions if needed for support

---

## Student Portal Functionality

### Dashboard

**Purpose:** Central hub for students to see their status and quick actions

**Features:**
- **Current Score Display:** Shows student's overall LMS score prominently
- **Quick Statistics:**
  - Total applications submitted
  - Applications pending review
  - Applications accepted/rejected
  - Number of qualified jobs available
- **Recent Job Listings:** Preview of latest job postings
- **Application Status Overview:** Summary of all application statuses
- **Notifications:** Alerts for application status changes, new qualified jobs

---

### Job Search & Discovery

**Purpose:** Allow students to find job opportunities

**Features:**

#### Job Listings View
- **Grid/List Display:** View jobs in grid or list format
- **Job Cards Show:**
  - Job title and company name
  - Job type (Full-time, Part-time, Internship, Contract)
  - Location
  - Required minimum score
  - Student's eligibility status (Qualified/Not Qualified badge)
  - Application deadline (if set)
  - Posted date

#### Search Functionality
- **Keyword Search:** Search by:
  - Job title
  - Company name
  - Job description content
  - Skills/requirements
- **Advanced Filters:**
  - Job type (Full-time, Part-time, Internship, Contract)
  - Industry/Category
  - Location
  - Required score range (to find jobs they qualify for)
  - Salary range (if applicable)
  - Experience level
  - Date posted
- **Sort Options:**
  - Relevance
  - Date posted (newest first)
  - Required score (lowest to highest)
  - Company name (alphabetical)

#### Job Detail View
- **Complete Job Information:**
  - Full job description
  - Company profile and details
  - Required minimum score (prominently displayed)
  - Student's current score vs. required score
  - Eligibility indicator (Qualified/Not Qualified)
  - Skill requirements
  - Qualifications needed
  - Job responsibilities
  - Benefits and perks
  - Application deadline
  - How to apply instructions
- **Eligibility Check:**
  - Real-time score comparison
  - Clear indication if student qualifies
  - Message explaining why they do/don't qualify
  - "Apply" button (enabled only if qualified)
- **Related Jobs:** Suggestions for similar positions

#### Qualified Jobs Filter
- **"Jobs I Qualify For" Filter:** Show only jobs where student's score meets requirement
- **"All Jobs" View:** Show all jobs with clear qualification indicators

---

### Application Management

**Purpose:** Allow students to apply to jobs and track applications

**Features:**

#### Application Submission
- **Pre-Application Validation:**
  - System checks student's current score
  - Compares with job's minimum required score
  - Blocks application if score is insufficient
  - Shows clear message if not qualified
- **Application Form:**
  - Student confirms they want to apply
  - Option to add cover letter/notes
  - Review of job details before submission
  - Confirmation of score requirement met
- **Application Confirmation:**
  - Success message upon submission
  - Application ID for tracking
  - Next steps information

#### Application Tracking
- **Application List View:**
  - All applications submitted by student
  - Status indicators for each application
  - Job title and company for each application
  - Date applied
  - Current status
- **Application Statuses:**
  - **Applied:** Successfully submitted, awaiting review
  - **Under Review:** HR is reviewing the application
  - **Interview Scheduled:** Interview has been arranged
  - **Accepted:** Application accepted, offer extended
  - **Rejected:** Application not successful
- **Application Detail View:**
  - Full job details
  - Application date and time
  - Score at time of application (snapshot)
  - Current application status
  - Status change history
  - HR notes (if visible to student)
  - Next steps or actions required

#### Application History
- **Historical View:** All past applications
- **Filter Options:**
  - By status
  - By company
  - By date range
  - By job type
- **Statistics:**
  - Total applications
  - Acceptance rate
  - Average response time

---

### Student Profile & Academic Display

**Purpose:** Show student's academic achievements and qualifications

**Features:**

#### Academic Profile Overview
- **Current Score Display:**
  - Overall LMS score (prominently shown)
  - Score breakdown (if available):
    - Course average
    - Test average
    - Project average
    - Hackathon average
- **Score Status:**
  - Last updated date
  - Score calculation method
  - Note if score is pending or incomplete

#### Course History
- **Enrolled Courses:**
  - List of all courses student is enrolled in
  - Course completion percentage
  - Course status (Enrolled, In Progress, Completed)
  - Completion date (if completed)
- **Course Details:**
  - Course title and description
  - Progress percentage
  - Time spent
  - Last accessed date

#### Test Performance
- **Test Scores:**
  - List of all tests taken
  - Score for each test
  - Passing status
  - Date completed
- **Test Statistics:**
  - Average test score
  - Total tests completed
  - Pass rate

#### Certificates & Achievements
- **Certificates Earned:**
  - List of all certificates
  - Certificate name and description
  - Issue date
  - Certificate preview/download
- **Achievements:**
  - List of achievements unlocked
  - Achievement descriptions
  - Unlock date

#### Hackathon Participation
- **Hackathon History:**
  - List of hackathons participated in
  - Hackathon scores (if available)
  - Awards/recognition received
  - Participation date

#### Skills Display
- **Skills Derived from LMS:**
  - Skills from completed courses
  - Skills from projects
  - Skills from certificates
- **Skills Format:**
  - Skill name
  - Proficiency level (if available)
  - Source (which course/project it came from)

---

### Notifications & Alerts

**Purpose:** Keep students informed about important updates

**Features:**
- **Application Status Updates:**
  - Notification when application status changes
  - Interview scheduling notifications
  - Acceptance/rejection notifications
- **New Job Alerts:**
  - Notifications for new jobs matching student's profile
  - Alerts for jobs student now qualifies for (if score improved)
- **Score Updates:**
  - Notification when score is updated
  - Alert if score improvement makes new jobs available
- **System Notifications:**
  - Platform announcements
  - Important updates

---

## HR Portal Functionality

### HR Dashboard

**Purpose:** Central hub for HR users to manage their company's job postings and applications

**Features:**
- **Company Profile Display:** Company name, logo, and basic information
- **Quick Statistics:**
  - Total active job listings
  - Total applications received
  - Applications pending review
  - Applications by status breakdown
- **Recent Activity:**
  - Latest applications received
  - Recent job postings
  - Status updates
- **Notifications:** Alerts for new applications, important updates

---

### Company Profile Management

**Purpose:** Allow HR to manage their company's information

**Features:**
- **Company Information:**
  - Company name
  - Company description
  - Industry/sector
  - Website URL
  - Company logo upload
  - Contact information
  - Location/address
- **Profile Visibility:** Control what information is visible to students
- **Profile Updates:** Edit and update company information

---

### Job Listing Management

**Purpose:** Create and manage job and internship postings

**Features:**

#### Create Job Listing
- **Basic Information:**
  - Job title
  - Job type (Full-time, Part-time, Internship, Contract)
  - Location
  - Department/team
- **Job Description:**
  - Detailed job description
  - Responsibilities
  - Requirements
  - Qualifications
  - Benefits and perks
- **Score Requirements (Critical Feature):**
  - **Minimum Required Score:** HR sets the minimum LMS score required
  - Score input field (numeric, 0-100)
  - Optional maximum score requirement
  - Clear indication that only students meeting this score can apply
- **Skill Requirements:**
  - List of required skills
  - Preferred skills
  - Skill proficiency levels
- **Additional Details:**
  - Salary range (optional)
  - Experience level required
  - Application deadline (optional)
  - Number of positions available
- **Job Status:**
  - Draft (not yet published)
  - Active (published and accepting applications)
  - Closed (no longer accepting applications)
- **Preview:** Preview job listing before publishing

#### Edit Job Listing
- **Update All Fields:** Modify any information in existing job listing
- **Status Management:** Change job status (Draft/Active/Closed)
- **Score Requirement Updates:**
  - Can update minimum required score
  - System shows impact (how many current applicants would be affected)
  - Warning if increasing score requirement

#### Job Listing List View
- **All Company Jobs:**
  - List of all job listings for the company
  - Status indicators
  - Number of applications received
  - Date posted
  - Quick actions (Edit, View Applications, Close)
- **Filter Options:**
  - By status (Draft, Active, Closed)
  - By job type
  - By date posted
- **Search:** Search jobs by title or description

#### Job Listing Analytics
- **Per Job Statistics:**
  - Total applications received
  - Applications by status
  - Average candidate score
  - Application trends over time

---

### Candidate & Application Management

**Purpose:** Review and manage applications from students

**Features:**

#### Application List View
- **All Applications:**
  - List of all applications for company's jobs
  - Filter by job posting
  - Filter by application status
  - Filter by candidate score range
  - Search by candidate name
- **Application Information Displayed:**
  - Candidate name
  - Job title applied for
  - Candidate's current score
  - Score at time of application
  - Application date
  - Current status
  - Quick view option

#### Application Detail View
- **Candidate Information:**
  - Full candidate profile
  - Current LMS score
  - Score at time of application
  - Academic history
  - Course completions
  - Test scores
  - Certificates
  - Achievements
  - Skills
- **Application Details:**
  - Application date and time
  - Cover letter/notes (if provided by student)
  - Status history
- **HR Actions:**
  - Update application status
  - Add HR notes (internal, not visible to student)
  - View full candidate academic profile
  - Download candidate information

#### Candidate Filtering & Search
- **Filter Options:**
  - By score range
  - By course completions
  - By certificates held
  - By skills
  - By application status
  - By job posting
- **Search:**
  - Search by candidate name
  - Search by skills
  - Search by qualifications

#### Application Status Management
- **Status Options:**
  - **Applied:** Initial status when student applies
  - **Under Review:** HR is actively reviewing
  - **Interview Scheduled:** Interview has been arranged
  - **Accepted:** Application accepted, offer extended
  - **Rejected:** Application not successful
- **Status Updates:**
  - Change status with notes
  - Status change history tracking
  - Automatic notifications to student
- **Bulk Actions:**
  - Update multiple applications at once
  - Bulk status changes

#### Candidate Comparison
- **Compare Candidates:**
  - Side-by-side comparison of multiple candidates
  - Compare scores, qualifications, skills
  - Helpful for decision-making

---

### Reporting & Analytics

**Purpose:** Provide insights into job postings and applications

**Features:**
- **Job Posting Analytics:**
  - Views per job
  - Applications received per job
  - Average candidate score per job
  - Time to fill positions
- **Application Analytics:**
  - Application trends over time
  - Status distribution
  - Candidate score distribution
- **Company Performance:**
  - Total jobs posted
  - Total applications received
  - Acceptance rate
  - Average time to hire

---

## Admin Portal Functionality

### Admin Dashboard

**Purpose:** Central hub for platform administration

**Features:**
- **Platform Statistics:**
  - Total students registered
  - Total companies collaborating
  - Total active job listings
  - Total applications submitted
  - Platform activity metrics
- **Recent Activity:**
  - New company registration requests
  - Recent job postings
  - Recent applications
  - System alerts
- **Quick Actions:**
  - Approve pending companies
  - View system health
  - Access user management

---

### Company Collaboration Management

**Purpose:** Manage company registrations and approvals

**Features:**

#### Company Registration Requests
- **Pending Requests List:**
  - List of companies requesting collaboration
  - Company information
  - Request date
  - Requested by (contact person)
- **Company Details Review:**
  - Full company information
  - Contact details
  - Business verification
  - Request history
- **Approval Actions:**
  - **Approve:** Approve company collaboration
    - Company status changes to "Active"
    - Company can now post jobs
    - HR users can be created for company
  - **Reject:** Reject company request
    - Provide rejection reason
    - Company status remains "Pending" or "Rejected"
    - Company cannot post jobs
- **Approved Companies Management:**
  - List of all approved companies
  - Company status (Active, Suspended, Inactive)
  - Company details
  - Edit company information
  - Suspend/Reactivate companies

#### Company Profile Management
- **View Company Details:**
  - Full company profile
  - Associated HR users
  - Job listings count
  - Application statistics
- **Edit Company Information:**
  - Update company details
  - Change company status
  - Manage company settings

---

### User Management

**Purpose:** Manage all user accounts across the platform

**Features:**

#### User List View
- **All Users:**
  - List of all users (Students, HR, Admin)
  - Filter by role
  - Filter by status (Active, Inactive)
  - Search by name or email
- **User Information Displayed:**
  - Name and email
  - Role
  - Status
  - Registration date
  - Last login date

#### User Detail Management
- **View User Profile:**
  - Full user information
  - Role and permissions
  - Account status
  - Activity history
- **User Actions:**
  - **Create User:** Create new user account
    - Set role (Student, HR, Admin)
    - Set initial password or send invitation
    - Link HR users to companies
  - **Edit User:**
    - Update user information
    - Change role (with restrictions)
    - Update permissions
  - **Deactivate User:**
    - Temporarily disable user account
    - User cannot login
    - Data preserved
  - **Activate User:**
    - Reactivate deactivated account
  - **Delete User:**
    - Permanently remove user account
    - Warning and confirmation required

#### HR User Management
- **Create HR Users:**
  - Create HR user account
  - Link to specific company
  - Set HR permissions
- **Manage HR-Company Links:**
  - View which HR users belong to which companies
  - Transfer HR users between companies
  - Remove HR users from companies

---

### Job Listing Oversight

**Purpose:** Monitor all job listings across the platform

**Features:**
- **All Job Listings:**
  - View all jobs from all companies
  - Filter by company
  - Filter by status
  - Filter by job type
  - Search jobs
- **Job Details:**
  - View full job information
  - See applications received
  - Monitor job status
- **Job Management:**
  - Edit job listings (if needed for support)
  - Close inappropriate job listings
  - Flag jobs for review

---

### Application Monitoring

**Purpose:** Oversee all applications across the platform

**Features:**
- **All Applications View:**
  - List of all applications from all students
  - Filter by company
  - Filter by job
  - Filter by status
  - Filter by student
- **Application Details:**
  - View full application information
  - See candidate profile
  - Monitor application status
- **Application Analytics:**
  - Platform-wide application statistics
  - Trends and patterns
  - Success rates

---

### System Configuration

**Purpose:** Configure platform settings and parameters

**Features:**
- **Scoring System Configuration:**
  - Configure score calculation parameters
  - Set score update frequency
  - Manage score calculation rules
- **Platform Settings:**
  - General platform configuration
  - Notification settings
  - System maintenance mode
- **Feature Flags:**
  - Enable/disable features
  - Control feature rollouts

---

### Analytics & Reporting

**Purpose:** Provide comprehensive platform analytics

**Features:**
- **Platform Statistics:**
  - Total users by role
  - Total companies
  - Total job listings
  - Total applications
  - Growth metrics
- **Activity Analytics:**
  - User activity trends
  - Job posting trends
  - Application trends
  - Score distribution
- **Performance Metrics:**
  - Average time to fill positions
  - Application success rates
  - Company engagement metrics
  - Student engagement metrics
- **Reports:**
  - Generate custom reports
  - Export data
  - Scheduled reports

---

## Core Business Rules

### Score-Based Application Rule (Critical)

**Rule:** Students can only apply to jobs if their current LMS score is equal to or greater than the minimum required score set by HR for that job.

**Implementation Details:**
- System checks student's score before allowing application submission
- Application button is disabled if score requirement is not met
- Clear message displayed if student doesn't qualify
- Score at time of application is captured and stored
- Real-time score validation occurs during application process

**Exceptions:**
- None - This is a hard requirement that cannot be bypassed

---

### Company Collaboration Rule

**Rule:** Companies must be approved by Admin before they can post jobs.

**Workflow:**
1. Company registers/requests collaboration
2. Company status is set to "Pending"
3. Admin reviews company information
4. Admin approves or rejects
5. If approved, company status becomes "Active"
6. Only active companies can post jobs

**HR User Creation:**
- HR users can only be created for approved companies
- HR users can only manage jobs for their assigned company

---

### Application Status Rules

**Rule:** Application statuses follow a defined workflow.

**Status Flow:**
- **Applied** → Can move to: Under Review, Rejected
- **Under Review** → Can move to: Interview Scheduled, Rejected
- **Interview Scheduled** → Can move to: Accepted, Rejected
- **Accepted** → Final status (cannot change)
- **Rejected** → Final status (cannot change, but can be reconsidered by HR)

**Rules:**
- Status can only move forward in the workflow (with exceptions)
- Once Accepted or Rejected, status is final (unless HR manually changes)
- Status changes are logged with timestamp and user

---

### Score Requirement Rules

**Rule:** HR must set a minimum required score for each job posting.

**Requirements:**
- Minimum score is mandatory (cannot be null)
- Score must be between 0 and 100
- Score can be updated after job is posted
- If score is increased, existing applicants are not affected (they applied with previous requirement)
- New applicants must meet the updated requirement

---

### Data Access Rules

**Rule:** Users can only access data appropriate to their role.

**Student Access:**
- Can view their own profile and applications
- Can view all job listings (public information)
- Cannot view other students' information
- Cannot view HR or company internal data

**HR Access:**
- Can view applications for their company's jobs only
- Can view candidate profiles for applicants to their jobs
- Cannot view other companies' jobs or applications
- Cannot view other HR users' data

**Admin Access:**
- Can view all data across the platform
- Can access all user accounts
- Can view all companies and jobs
- Can view all applications

---

### Score Display Rules

**Rule:** Student scores are read-only and come from LMS.

**Requirements:**
- Scores cannot be modified in Dakshath
- Scores are retrieved from LMS system
- If score is not available, system shows "Score Pending"
- Score updates are reflected in real-time (or near real-time)
- Historical score snapshots are preserved (score at application time)

---

## User Flows & Workflows

### Student Application Flow

**Step 1: Browse Jobs**
- Student logs into Dakshath
- Views job listings page
- Browses available opportunities
- Uses search and filters to find relevant jobs

**Step 2: View Job Details**
- Student clicks on a job listing
- Views complete job description
- Sees required minimum score
- Sees their current score
- System displays eligibility status

**Step 3: Eligibility Check**
- System compares student's score with required score
- If score >= required: Shows "Qualified" badge, enables "Apply" button
- If score < required: Shows "Not Qualified" badge, disables "Apply" button, shows message

**Step 4: Application Submission (If Qualified)**
- Student clicks "Apply" button
- System validates score again (double-check)
- Student reviews job details
- Student can add cover letter/notes (optional)
- Student confirms application
- System captures score snapshot
- Application is submitted
- Status set to "Applied"
- Confirmation message shown

**Step 5: Application Tracking**
- Student views their applications
- Sees application status
- Receives notifications on status changes
- Can view application details anytime

---

### HR Job Posting Flow

**Step 1: Create Job Listing**
- HR user logs into Dakshath
- Navigates to "Create Job" page
- Fills in job information:
  - Basic details (title, type, location)
  - Job description
  - Requirements and qualifications
  - **Sets minimum required score** (mandatory)
  - Skill requirements
  - Additional details
- Sets job status to "Draft" or "Active"

**Step 2: Review & Publish**
- HR reviews job listing
- Uses preview feature
- Makes any necessary edits
- Publishes job (status: "Active")
- Job becomes visible to students

**Step 3: Receive Applications**
- Students apply to the job
- Applications appear in HR's application list
- HR receives notifications for new applications

**Step 4: Review Applications**
- HR views application list
- Filters and searches applications
- Opens application details
- Reviews candidate profile and academic history
- Reviews candidate's score

**Step 5: Update Application Status**
- HR evaluates candidate
- Updates application status:
  - Under Review
  - Interview Scheduled
  - Accepted
  - Rejected
- Adds internal notes (if needed)
- Student receives notification

---

### Company Collaboration Flow

**Step 1: Company Registration**
- Company representative requests collaboration
- Fills in company information
- Submits registration request
- Status set to "Pending"

**Step 2: Admin Review**
- Admin receives notification of new request
- Admin reviews company information
- Admin verifies company details

**Step 3: Admin Decision**
- **If Approved:**
  - Admin approves company
  - Company status changes to "Active"
  - Company can now post jobs
  - HR users can be created for company
  - Company receives approval notification

- **If Rejected:**
  - Admin rejects with reason
  - Company status remains "Pending" or "Rejected"
  - Company cannot post jobs
  - Company receives rejection notification with reason

**Step 4: HR User Creation**
- Admin or approved company creates HR user
- HR user is linked to company
- HR user can now manage company's jobs

---

### Score Validation Flow

**Step 1: Score Retrieval**
- Student accesses Dakshath
- System retrieves student's current score from LMS
- Score is displayed on student's profile

**Step 2: Job Eligibility Check**
- Student views a job listing
- System retrieves job's minimum required score
- System compares student score with required score
- Eligibility status is determined

**Step 3: Application Validation**
- When student attempts to apply
- System performs real-time score validation
- If valid: Application proceeds
- If invalid: Application is blocked with message

**Step 4: Score Snapshot**
- Upon successful application
- System captures student's score at that moment
- Score snapshot is stored with application
- This preserves score even if student's score changes later

---

## Feature Details

### Search & Filter System

**Search Capabilities:**
- **Keyword Search:** Full-text search across job titles, descriptions, company names
- **Multi-field Search:** Search across multiple fields simultaneously
- **Fuzzy Matching:** Find results even with minor spelling variations

**Filter Options:**
- **Job Type:** Full-time, Part-time, Internship, Contract
- **Industry/Category:** Filter by industry sectors
- **Location:** Filter by city, state, or remote options
- **Score Range:** Filter by required score (useful for finding qualified jobs)
- **Salary Range:** Filter by compensation (if available)
- **Experience Level:** Entry-level, Mid-level, Senior
- **Date Posted:** Recent jobs, last week, last month
- **Company:** Filter by specific companies

**Sort Options:**
- Relevance (based on search query)
- Date posted (newest/oldest)
- Required score (lowest/highest)
- Company name (alphabetical)
- Application deadline (if applicable)

---

### Notification System

**Notification Types:**

#### For Students:
- **Application Status Updates:** When HR changes application status
- **New Qualified Jobs:** When new jobs become available that student qualifies for
- **Score Updates:** When student's score is updated (may unlock new opportunities)
- **Interview Scheduling:** When interview is scheduled
- **Application Reminders:** Reminders about pending applications

#### For HR:
- **New Applications:** When student applies to their job
- **Application Updates:** When application status needs attention
- **Job Expiry Reminders:** When job posting is about to expire
- **System Notifications:** Platform updates and announcements

#### For Admin:
- **Company Registration Requests:** New companies requesting collaboration
- **System Alerts:** Platform issues or important events
- **User Activity Alerts:** Unusual activity or security concerns

**Notification Channels:**
- In-app notifications (notification center)
- Email notifications (optional, user preference)
- Real-time alerts (browser notifications, if enabled)

---

### Profile Display System

**Student Profile Components:**

1. **Score Section:**
   - Overall score (large, prominent display)
   - Score breakdown (if available)
   - Score last updated date
   - Score calculation method

2. **Academic History:**
   - Course enrollments and completions
   - Test scores and performance
   - Project completions
   - Hackathon participation

3. **Achievements:**
   - Certificates earned
   - Achievements unlocked
   - Awards and recognition

4. **Skills:**
   - Skills derived from courses
   - Skills from projects
   - Skill proficiency levels

**HR View of Candidate Profile:**
- Same information as student sees
- Additional context for evaluation
- Academic performance trends
- Complete application history

---

### Application Management System

**Application Lifecycle:**

1. **Creation:** Student submits application
2. **Review:** HR reviews application
3. **Evaluation:** HR evaluates candidate
4. **Decision:** HR makes decision (Accept/Reject)
5. **Communication:** Status updates communicated to student
6. **Completion:** Process completes (Accepted or Rejected)

**Application Data:**
- Application ID (unique identifier)
- Student information
- Job information
- Application date and time
- Score at application time (snapshot)
- Current application status
- Status change history
- HR notes (internal)
- Student notes (if provided)

---

## Integration with LMS

### Data Integration Points

**Student Data:**
- User accounts (authentication)
- Student profiles (name, email, etc.)
- Course enrollments
- Course progress
- Test attempts and scores
- Certificates earned
- Achievements unlocked
- Hackathon participation
- Project completions

**Score Data:**
- Test scores from `test_attempts` table
- Course completion rates from `enrollments` table
- Project scores (if available)
- Hackathon scores (if available)
- Overall aggregated score (when scoring system is implemented)

### Data Access Rules

**Read-Only Access:**
- Dakshath can only read LMS data
- Dakshath cannot modify LMS data
- All student academic data is read-only in Dakshath

**Real-Time Access:**
- Data is accessed in real-time from shared database
- Changes in LMS are immediately reflected in Dakshath
- No data synchronization needed (same database)

**Data Privacy:**
- Student data is only accessible to:
  - The student themselves
  - HR users reviewing their applications
  - Administrators (for support purposes)

---

## Scoring System Requirements

### Current State

**Available Score Data:**
- Individual test scores (from test attempts)
- Course completion percentages
- Hackathon scores (if available)
- Project scores (if available)

**Missing:**
- Aggregated overall student score
- Standardized score calculation method
- Score update mechanism

### Future Scoring System Requirements

**When Scoring System is Implemented:**

1. **Score Calculation:**
   - Aggregate scores from multiple sources
   - Weighted calculation (tests, courses, projects, hackathons)
   - Standardized scoring method
   - Regular score updates

2. **Score Storage:**
   - Store overall score per student
   - Store score breakdown (component scores)
   - Track score history
   - Store score calculation timestamp

3. **Score Usage in Dakshath:**
   - Real-time score retrieval
   - Score comparison with job requirements
   - Score-based job matching
   - Score display on student profiles
   - Score validation for applications

4. **Score Updates:**
   - Automatic updates when LMS data changes
   - Scheduled score recalculation
   - Score change notifications
   - Historical score tracking

### Temporary Solution (Until Scoring System is Ready)

**Interim Approach:**
- Calculate temporary score from available LMS data
- Simple aggregation method
- Clearly marked as "Temporary" or "Estimated"
- Will be replaced when official scoring system is ready

---

## Summary

### Key Functionalities

1. **Student Portal:**
   - Job search and discovery
   - Score-based application system
   - Application tracking
   - Academic profile display

2. **HR Portal:**
   - Company profile management
   - Job posting creation and management
   - Score requirement setting
   - Candidate review and application management

3. **Admin Portal:**
   - Company collaboration approval
   - User management
   - Platform oversight
   - System configuration

### Core Business Logic

- **Score-Based Applications:** Students can only apply if score requirement is met
- **Company Collaboration:** Companies must be approved before posting jobs
- **Role-Based Access:** Each role has specific permissions and access levels
- **Real-Time Score Validation:** Scores are checked in real-time during application process

### Integration Points

- **LMS Integration:** Student data and scores from LMS
- **Shared Database:** Real-time data access
- **Authentication:** Shared user authentication system

---

**Document Status:** Complete Functionality Overview  
**Last Updated:** November 2025  
**Purpose:** Functional requirements and feature specification for Dakshath platform

---

_This document describes what Dakshath does and how it functions, without implementation details. It serves as the functional specification for the platform._

