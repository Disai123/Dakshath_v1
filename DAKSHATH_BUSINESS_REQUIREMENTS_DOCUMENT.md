# Dakshath - Business Requirements Document (BRD)

**Document Version:** 1.0  
**Date:** November 2025  
**Project:** Dakshath - Job/Internship Platform  
**Document Type:** Business Requirements Document  
**Prepared by:** Business Analysis Team

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Business Objectives](#business-objectives)
3. [Stakeholders](#stakeholders)
4. [Business Context](#business-context)
5. [Business Requirements](#business-requirements)
6. [Success Criteria](#success-criteria)
7. [Business Rules](#business-rules)
8. [Business Value Proposition](#business-value-proposition)
9. [Scope & Boundaries](#scope--boundaries)
10. [Assumptions & Constraints](#assumptions--constraints)
11. [Risk Assessment](#risk-assessment)
12. [Future Roadmap](#future-roadmap)

---

## Executive Summary

### Project Overview

Dakshath is a job and internship discovery platform designed to bridge the gap between academic achievement and career opportunities. The platform connects students from the Learning Management System (LMS) with collaborating companies, ensuring that job applications are based on verified academic performance scores.

### Business Problem

Currently, there is no integrated system that:
- Connects student academic performance with job opportunities
- Ensures students apply only to positions matching their qualifications
- Provides companies with pre-qualified candidates based on academic achievements
- Streamlines the recruitment process for both students and employers

### Business Solution

Dakshath provides a comprehensive platform where:
- **Students** can discover job opportunities matched to their LMS academic scores
- **Companies/HR** can post positions with minimum score requirements and receive applications only from qualified candidates
- **Administrators** can manage the platform, approve company collaborations, and ensure system integrity

### Key Business Benefits

- **For Students:** Access to career opportunities aligned with their academic achievements
- **For Companies:** Streamlined recruitment with pre-qualified candidates
- **For Educational Institution:** Enhanced value proposition connecting learning to careers
- **For Platform:** Sustainable business model through company collaborations

---

## Business Objectives

### Primary Business Goals

1. **Student Career Development**
   - Enable students to find job opportunities based on their academic performance
   - Provide transparent matching between student qualifications and job requirements
   - Increase student engagement with career opportunities

2. **Employer Recruitment Efficiency**
   - Reduce time-to-hire by pre-qualifying candidates
   - Ensure applications only from candidates meeting minimum requirements
   - Provide access to verified academic credentials

3. **Platform Growth & Sustainability**
   - Establish partnerships with companies for job postings
   - Create a sustainable business model through company collaborations
   - Build a reputation as a trusted job matching platform

4. **Data-Driven Matching**
   - Implement score-based application system to ensure quality matches
   - Provide analytics and insights for both students and employers
   - Enable evidence-based hiring decisions

### Success Metrics

**Student Engagement:**
- 80% of eligible students register on Dakshath within 6 months
- 60% of registered students apply to at least one job within 3 months
- Average of 3 applications per active student

**Company Engagement:**
- 50+ companies collaborating within first year
- Average of 5 job postings per company per quarter
- 70% company retention rate

**Application Quality:**
- 90% of applications meet minimum score requirements
- 40% application-to-interview conversion rate
- 25% application-to-hire conversion rate

**Platform Performance:**
- 99% uptime
- Average response time < 2 seconds
- User satisfaction score > 4.0/5.0

---

## Stakeholders

### Primary Stakeholders

#### 1. Students
- **Role:** End users seeking job opportunities
- **Business Needs:**
  - Easy access to relevant job opportunities
  - Clear understanding of qualification requirements
  - Transparent application process
  - Career development support
- **Success Criteria:** Ability to find and apply to suitable jobs based on their scores

#### 2. Companies/HR Representatives
- **Role:** Employers posting jobs and hiring candidates
- **Business Needs:**
  - Efficient candidate sourcing
  - Pre-qualified applicants
  - Access to verified academic credentials
  - Streamlined recruitment process
- **Success Criteria:** Receive quality applications and reduce time-to-hire

#### 3. Platform Administrators
- **Role:** Manage platform operations and company partnerships
- **Business Needs:**
  - Efficient platform management
  - Company collaboration approval workflow
  - System monitoring and analytics
  - User support capabilities
- **Success Criteria:** Smooth platform operations and growing company partnerships

#### 4. Educational Institution (LMS Owner)
- **Role:** Provider of student academic data
- **Business Needs:**
  - Enhanced value proposition for students
  - Career development support
  - Data security and privacy
  - Integration with existing LMS
- **Success Criteria:** Improved student outcomes and satisfaction

### Secondary Stakeholders

#### 5. HR Managers/Recruiters
- **Role:** Review applications and make hiring decisions
- **Business Needs:** Access to candidate profiles and academic history

#### 6. IT/Technical Team
- **Role:** System development and maintenance
- **Business Needs:** Clear requirements, scalable architecture, maintainable code

#### 7. Business Development Team
- **Role:** Company partnerships and growth
- **Business Needs:** Tools to track partnerships and company engagement

---

## Business Context

### Current State

**LMS System:**
- Comprehensive learning management system tracking student academic performance
- Student data including courses, tests, projects, and hackathons
- Scoring data available but not aggregated into overall student scores
- No direct connection to job opportunities

**Recruitment Landscape:**
- Students apply to jobs through various channels
- No verification of academic qualifications during application
- Companies receive many unqualified applications
- Time-consuming screening process

### Desired Future State

**Integrated Platform:**
- Students access job opportunities directly from their academic portal
- Score-based matching ensures qualified applications
- Companies receive pre-qualified candidates
- Streamlined recruitment process with verified credentials

### Business Drivers

1. **Student Demand:** Students want easier access to career opportunities
2. **Employer Need:** Companies need efficient ways to find qualified candidates
3. **Competitive Advantage:** Unique integration of academic performance with job matching
4. **Market Opportunity:** Growing demand for skills-based hiring
5. **Institutional Value:** Enhanced student outcomes and career support

---

## Business Requirements

### Functional Business Requirements

#### BR-001: Score-Based Application System
**Requirement:** Students must only be able to apply to jobs where their LMS score meets or exceeds the minimum required score set by the employer.

**Business Justification:** Ensures quality applications and reduces time spent on unqualified candidates.

**Priority:** Critical

**Acceptance Criteria:**
- System validates student score before allowing application
- Application button is disabled if score requirement not met
- Clear messaging when student doesn't qualify
- Score snapshot captured at application time

---

#### BR-002: Company Collaboration Management
**Requirement:** Companies must be approved by administrators before they can post jobs on the platform.

**Business Justification:** Maintains platform quality and ensures legitimate job opportunities.

**Priority:** High

**Acceptance Criteria:**
- Company registration workflow with approval process
- Only approved companies can post jobs
- Admin can approve/reject with reasons
- Company status tracking

---

#### BR-003: Three-Tier User System
**Requirement:** Platform must support three distinct user roles: Student, HR, and Admin, each with appropriate access and permissions.

**Business Justification:** Ensures proper access control and data security.

**Priority:** Critical

**Acceptance Criteria:**
- Separate login portals for each role
- Role-based access control
- Students can only view their own data
- HR can only manage their company's jobs
- Admin has full platform access

---

#### BR-004: Job Posting with Score Requirements
**Requirement:** HR users must be able to create job postings and set minimum required LMS scores for each position.

**Business Justification:** Allows companies to specify qualification requirements upfront.

**Priority:** Critical

**Acceptance Criteria:**
- HR can create job listings with all required fields
- Minimum score requirement is mandatory
- Score requirement is clearly displayed to students
- HR can update score requirements (with impact notification)

---

#### BR-005: Student Profile Display
**Requirement:** Students must be able to view their academic profile including current LMS score, course history, test scores, certificates, and achievements.

**Business Justification:** Students need to understand their qualifications and see what employers will see.

**Priority:** High

**Acceptance Criteria:**
- Display current overall score prominently
- Show course enrollments and completions
- Display test scores and performance
- Show certificates and achievements
- Display skills derived from LMS

---

#### BR-006: Application Management
**Requirement:** Students must be able to apply to jobs, track application status, and view application history.

**Business Justification:** Students need visibility into their job application process.

**Priority:** High

**Acceptance Criteria:**
- Students can submit applications (if qualified)
- Application status tracking (Applied, Under Review, Interview Scheduled, Accepted, Rejected)
- Application history view
- Status change notifications

---

#### BR-007: Candidate Review for HR
**Requirement:** HR users must be able to view applications, review candidate profiles with academic history, and update application status.

**Business Justification:** HR needs tools to efficiently evaluate candidates.

**Priority:** High

**Acceptance Criteria:**
- View all applications for company's jobs
- Access full candidate academic profiles
- Filter and search candidates
- Update application status
- Add internal notes

---

#### BR-008: Job Search and Discovery
**Requirement:** Students must be able to search, filter, and browse job listings with clear indication of qualification status.

**Business Justification:** Students need efficient ways to find relevant opportunities.

**Priority:** High

**Acceptance Criteria:**
- Keyword search functionality
- Advanced filters (job type, location, score range, etc.)
- Clear qualification indicators (Qualified/Not Qualified)
- "Jobs I Qualify For" filter option
- Sort and pagination

---

#### BR-009: Company Profile Management
**Requirement:** HR users must be able to create and manage their company profile visible to students.

**Business Justification:** Companies need to present their brand and opportunities effectively.

**Priority:** Medium

**Acceptance Criteria:**
- Create and edit company profile
- Upload company logo
- Set company information (description, industry, location, etc.)
- Control profile visibility

---

#### BR-010: Platform Analytics
**Requirement:** Administrators must have access to platform-wide analytics including user statistics, job posting trends, and application metrics.

**Business Justification:** Administrators need insights to manage and grow the platform.

**Priority:** Medium

**Acceptance Criteria:**
- Platform statistics dashboard
- User activity analytics
- Job posting trends
- Application success rates
- Company engagement metrics

---

### Non-Functional Business Requirements

#### NFR-001: Performance
**Requirement:** System must support 1000+ concurrent users with response times under 2 seconds.

**Business Justification:** Ensures good user experience as platform grows.

**Priority:** High

---

#### NFR-002: Security
**Requirement:** Student academic data must be protected with appropriate access controls and encryption.

**Business Justification:** Protects sensitive student information and maintains trust.

**Priority:** Critical

---

#### NFR-003: Availability
**Requirement:** Platform must maintain 99% uptime during business hours.

**Business Justification:** Ensures platform is accessible when users need it.

**Priority:** High

---

#### NFR-004: Scalability
**Requirement:** System architecture must support growth to 10,000+ students and 500+ companies.

**Business Justification:** Platform must scale with business growth.

**Priority:** Medium

---

#### NFR-005: Usability
**Requirement:** Platform must be intuitive and require minimal training for all user types.

**Business Justification:** Reduces support burden and increases adoption.

**Priority:** High

---

#### NFR-006: Integration
**Requirement:** Platform must integrate seamlessly with existing LMS without disrupting LMS operations.

**Business Justification:** Maintains existing system stability while adding new capabilities.

**Priority:** Critical

---

## Success Criteria

### Student Success Metrics

**Adoption:**
- 80% of eligible students register within 6 months of launch
- 60% of registered students are active (login at least once per month)
- 50% of active students apply to at least one job

**Engagement:**
- Average of 5 job views per student per session
- Average of 3 applications per active student
- 70% of students return to platform within 30 days

**Satisfaction:**
- Student satisfaction score > 4.0/5.0
- < 5% support ticket rate
- Positive feedback on score-based matching

---

### Company Success Metrics

**Adoption:**
- 50+ companies collaborating within first year
- 70% company retention rate
- Average of 5 job postings per company per quarter

**Engagement:**
- 80% of companies post at least one job within 30 days of approval
- Average of 10 applications per job posting
- 60% of companies post multiple jobs

**Satisfaction:**
- Company satisfaction score > 4.0/5.0
- 80% of companies would recommend platform
- Positive feedback on candidate quality

---

### Platform Success Metrics

**Performance:**
- 99% uptime
- Average response time < 2 seconds
- < 1% error rate

**Quality:**
- 90% of applications meet minimum score requirements
- 40% application-to-interview conversion rate
- 25% application-to-hire conversion rate

**Growth:**
- 20% month-over-month user growth (first 6 months)
- 15% month-over-month company growth (first 6 months)
- 10% month-over-month application growth (first 6 months)

---

## Business Rules

### BR-001: Score-Based Application Rule
**Rule:** Students can only apply to jobs if their current LMS score >= job's minimum required score.

**Enforcement:** System-level validation that cannot be bypassed.

**Business Impact:** Ensures quality applications and reduces screening time.

**Exceptions:** None

---

### BR-002: Company Approval Rule
**Rule:** Companies must be approved by Admin before they can post jobs.

**Enforcement:** System prevents job posting until company status is "Active".

**Business Impact:** Maintains platform quality and legitimacy.

**Exceptions:** None

---

### BR-003: HR-Company Association Rule
**Rule:** HR users can only manage jobs for their assigned company.

**Enforcement:** System validates HR user's company association before allowing job management.

**Business Impact:** Prevents unauthorized access and maintains data security.

**Exceptions:** None

---

### BR-004: Score Requirement Mandatory Rule
**Rule:** All job postings must have a minimum required score (cannot be null).

**Enforcement:** System validation prevents job creation without score requirement.

**Business Impact:** Ensures all jobs have clear qualification criteria.

**Exceptions:** None

---

### BR-005: Application Status Workflow Rule
**Rule:** Application statuses must follow defined workflow: Applied → Under Review → Interview Scheduled → Accepted/Rejected.

**Enforcement:** System validates status transitions.

**Business Impact:** Maintains consistent application process.

**Exceptions:** HR can manually override in special cases (with audit log)

---

### BR-006: Score Snapshot Rule
**Rule:** Student's score at application time must be captured and preserved.

**Enforcement:** System automatically captures score snapshot upon application submission.

**Business Impact:** Preserves historical accuracy even if student's score changes.

**Exceptions:** None

---

### BR-007: Data Read-Only Rule
**Rule:** Dakshath can only read LMS data, never modify it.

**Enforcement:** Database permissions and application logic.

**Business Impact:** Protects LMS data integrity.

**Exceptions:** None

---

### BR-008: Role-Based Access Rule
**Rule:** Users can only access data appropriate to their role.

**Enforcement:** Role-based access control at application and database level.

**Business Impact:** Protects user privacy and data security.

**Exceptions:** Admin can access all data for support purposes

---

## Business Value Proposition

### For Students

**Value:**
- Direct access to job opportunities matched to their qualifications
- Transparent understanding of job requirements
- Reduced time searching for suitable positions
- Career development support

**ROI:**
- Time saved in job search
- Higher application success rate due to better matching
- Career advancement opportunities

---

### For Companies/HR

**Value:**
- Pre-qualified candidates (score-verified)
- Reduced time-to-hire
- Lower recruitment costs
- Access to verified academic credentials
- Streamlined application review process

**ROI:**
- Reduced screening time (estimated 50% reduction)
- Higher quality applications
- Lower cost per hire
- Faster time-to-fill positions

---

### For Educational Institution

**Value:**
- Enhanced value proposition for students
- Career development support
- Improved student outcomes
- Competitive advantage in student recruitment
- Data insights into student performance and career paths

**ROI:**
- Increased student satisfaction
- Higher student retention
- Enhanced institutional reputation
- Better student placement rates

---

### For Platform

**Value:**
- Sustainable business model through company partnerships
- Growing user base
- Market differentiation
- Data insights for platform improvement

**ROI:**
- Revenue from company partnerships (future)
- Platform growth and scalability
- Market leadership position

---

## Scope & Boundaries

### In Scope

**Core Features:**
- Student job search and application system
- HR job posting and candidate management
- Admin company approval and platform management
- Score-based application validation
- Student profile display from LMS data
- Application status tracking
- Company collaboration workflow

**User Roles:**
- Student portal
- HR portal
- Admin portal

**Integration:**
- LMS database integration (read-only)
- Shared authentication system
- Real-time score validation

---

### Out of Scope (Phase 1)

**Not Included:**
- Payment processing for companies
- Advanced analytics and reporting (basic only)
- Mobile applications (web-only initially)
- Email notifications (in-app only initially)
- Resume/CV upload and management
- Interview scheduling system
- Background check integration
- Multi-language support
- Video interviews
- Candidate messaging system

**Future Considerations:**
- These features may be added in future phases based on business needs

---

## Assumptions & Constraints

### Assumptions

1. **Scoring System:**
   - Assumption: LMS scoring system will be implemented in the future
   - Impact: Temporary scoring solution needed until official system is ready

2. **User Adoption:**
   - Assumption: Students will actively use the platform for job searching
   - Impact: Marketing and onboarding may be needed

3. **Company Partnerships:**
   - Assumption: Companies will be interested in collaborating with the platform
   - Impact: Business development effort required

4. **Data Availability:**
   - Assumption: LMS will have sufficient student data for scoring
   - Impact: May need to handle cases with incomplete data

5. **Technical Infrastructure:**
   - Assumption: Shared database approach will work effectively
   - Impact: Requires careful database design and access control

---

### Constraints

1. **Technical Constraints:**
   - Must use existing LMS database (shared database approach)
   - Cannot modify LMS codebase
   - Must maintain LMS system stability
   - Limited to read-only access to LMS data

2. **Business Constraints:**
   - Budget limitations for initial development
   - Timeline constraints for launch
   - Resource availability for development and support

3. **Regulatory Constraints:**
   - Data privacy regulations (GDPR, etc.)
   - Student data protection requirements
   - Educational data compliance

4. **Operational Constraints:**
   - Limited support resources initially
   - Manual company approval process (may need automation later)
   - Score calculation may be resource-intensive

---

## Risk Assessment

### High-Risk Items

#### Risk 1: Scoring System Not Ready
**Description:** LMS scoring system may not be implemented when Dakshath launches.

**Impact:** High - Core functionality depends on scores

**Probability:** Medium

**Mitigation:**
- Implement temporary scoring solution
- Clearly communicate temporary nature to users
- Plan migration path to official scoring system

---

#### Risk 2: Low Student Adoption
**Description:** Students may not actively use the platform.

**Impact:** High - Platform success depends on student engagement

**Probability:** Medium

**Mitigation:**
- Marketing and awareness campaigns
- Integration with LMS for easy access
- Incentives for early adopters
- User-friendly interface design

---

#### Risk 3: Insufficient Company Partnerships
**Description:** Not enough companies may collaborate to provide job opportunities.

**Impact:** High - Platform needs jobs to be valuable

**Probability:** Medium

**Mitigation:**
- Active business development
- Value proposition communication
- Pilot program with select companies
- Flexible partnership models

---

#### Risk 4: Data Privacy Concerns
**Description:** Concerns about sharing student academic data with companies.

**Impact:** High - Could prevent platform adoption

**Probability:** Low

**Mitigation:**
- Clear privacy policies
- Transparent data sharing practices
- Student consent mechanisms
- Compliance with data protection regulations

---

### Medium-Risk Items

#### Risk 5: Performance Issues
**Description:** System may not handle concurrent users effectively.

**Impact:** Medium - Affects user experience

**Probability:** Low

**Mitigation:**
- Load testing before launch
- Scalable architecture design
- Performance monitoring
- Optimization strategies

---

#### Risk 6: Integration Challenges
**Description:** Integration with LMS may face technical challenges.

**Impact:** Medium - Could delay launch

**Probability:** Medium

**Mitigation:**
- Early integration testing
- Phased rollout approach
- Fallback mechanisms
- Close collaboration with LMS team

---

#### Risk 7: Score Calculation Accuracy
**Description:** Temporary score calculation may not be accurate.

**Impact:** Medium - Could affect matching quality

**Probability:** Medium

**Mitigation:**
- Transparent calculation method
- Clear communication to users
- Regular validation
- Quick migration to official system

---

### Low-Risk Items

#### Risk 8: User Training Needs
**Description:** Users may need training to use the platform effectively.

**Impact:** Low - Can be addressed with documentation

**Probability:** Medium

**Mitigation:**
- Comprehensive documentation
- Video tutorials
- In-app help features
- Support resources

---

## Future Roadmap

### Phase 2: Enhanced Features (Months 7-12)

**Planned Features:**
- Email notifications
- Advanced analytics and reporting
- Resume/CV management
- Interview scheduling system
- Candidate messaging
- Mobile-responsive optimization

**Business Value:** Enhanced user experience and engagement

---

### Phase 3: Advanced Features (Year 2)

**Planned Features:**
- Mobile applications (iOS/Android)
- Video interview integration
- Background check integration
- Multi-language support
- Advanced matching algorithms
- AI-powered job recommendations

**Business Value:** Market leadership and competitive advantage

---

### Phase 4: Scale & Expansion (Year 3+)

**Planned Features:**
- Multi-institution support
- International expansion
- Enterprise features
- API for third-party integrations
- Marketplace features

**Business Value:** Platform growth and revenue diversification

---

## Approval & Sign-off

### Document Approval

**Business Stakeholders:**
- [ ] Business Owner
- [ ] Product Manager
- [ ] Student Representative
- [ ] Company/HR Representative
- [ ] Platform Administrator

**Technical Stakeholders:**
- [ ] Technical Lead
- [ ] LMS Integration Team
- [ ] Security Team

**Final Approval:**
- [ ] Project Sponsor
- [ ] Executive Approval

---

**Document Status:** Draft for Review  
**Last Updated:** November 2025  
**Next Review:** After stakeholder feedback

---

_This Business Requirements Document defines the business needs, objectives, and success criteria for the Dakshath platform. It serves as the foundation for technical design and implementation planning._

