# Dakshath - UI/UX Design Document

**Document Version:** 1.0  
**Date:** November 2025  
**Project:** Dakshath - Job/Internship Platform  
**Document Type:** UI/UX Design Specification  
**Prepared by:** Design Team

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Design System](#design-system)
3. [Color Palette](#color-palette)
4. [Typography](#typography)
5. [Component Library](#component-library)
6. [Layout Patterns](#layout-patterns)
7. [Student Portal UI/UX](#student-portal-uiux)
8. [HR Portal UI/UX](#hr-portal-uiux)
9. [Admin Portal UI/UX](#admin-portal-uiux)
10. [Responsive Design](#responsive-design)
11. [Accessibility Guidelines](#accessibility-guidelines)
12. [Animation & Interactions](#animation--interactions)
13. [Design Assets](#design-assets)

---

## Design Philosophy

### Core Design Principles

1. **Clarity First**
   - Clean, uncluttered interfaces
   - Clear visual hierarchy
   - Intuitive navigation
   - Obvious call-to-actions

2. **Trust & Professionalism**
   - Professional color scheme
   - Consistent design language
   - Reliable and polished appearance
   - Transparent information display

3. **User-Centric**
   - Role-specific interfaces
   - Contextual information
   - Progressive disclosure
   - Helpful guidance

4. **Efficiency**
   - Quick access to key features
   - Minimal clicks to complete tasks
   - Smart defaults
   - Batch operations where applicable

5. **Accessibility**
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader support
   - High contrast options

### Design Style

**Modern & Clean:**
- Minimalist approach with purposeful whitespace
- Card-based layouts
- Subtle shadows and borders
- Smooth transitions and micro-interactions

**Professional & Trustworthy:**
- Corporate color palette
- Professional typography
- Consistent iconography
- Clear data visualization

**Engaging & Friendly:**
- Warm accent colors
- Approachable language
- Encouraging feedback
- Positive reinforcement

---

## Design System

### Spacing Scale

```
4px   - Extra small spacing (icons, badges)
8px   - Small spacing (tight elements)
12px  - Default spacing (form fields)
16px  - Medium spacing (component padding)
24px  - Large spacing (section gaps)
32px  - Extra large spacing (major sections)
48px  - XXL spacing (page sections)
64px  - XXXL spacing (hero sections)
```

### Border Radius

```
4px   - Small elements (badges, tags)
8px   - Default (buttons, inputs)
12px  - Cards, containers
16px  - Large cards, modals
24px  - Hero sections, banners
```

### Shadows

```
Level 1 (Subtle): 0 1px 2px rgba(0, 0, 0, 0.05)
Level 2 (Default): 0 2px 4px rgba(0, 0, 0, 0.08)
Level 3 (Elevated): 0 4px 8px rgba(0, 0, 0, 0.12)
Level 4 (Floating): 0 8px 16px rgba(0, 0, 0, 0.15)
Level 5 (Modal): 0 16px 32px rgba(0, 0, 0, 0.2)
```

### Grid System

- **Desktop:** 12-column grid with 24px gutters
- **Tablet:** 8-column grid with 16px gutters
- **Mobile:** 4-column grid with 12px gutters
- **Max Container Width:** 1280px (centered)

---

## Color Palette

### Primary Colors

**Brand Blue (Primary)**
- `#2563EB` - Primary actions, links, active states
- `#1D4ED8` - Hover states
- `#1E40AF` - Pressed states
- `#DBEAFE` - Light background, subtle highlights

**Success Green**
- `#10B981` - Success messages, qualified badges
- `#059669` - Hover states
- `#D1FAE5` - Success backgrounds

**Warning Orange**
- `#F59E0B` - Warnings, pending states
- `#D97706` - Hover states
- `#FEF3C7` - Warning backgrounds

**Error Red**
- `#EF4444` - Errors, rejected states
- `#DC2626` - Hover states
- `#FEE2E2` - Error backgrounds

**Info Blue**
- `#3B82F6` - Information messages
- `#2563EB` - Hover states
- `#DBEAFE` - Info backgrounds

### Neutral Colors

**Grayscale**
- `#0F172A` - Primary text (Dark)
- `#1E293B` - Secondary text
- `#475569` - Tertiary text, placeholders
- `#64748B` - Disabled text
- `#94A3B8` - Borders, dividers
- `#CBD5E1` - Light borders
- `#E2E8F0` - Background borders
- `#F1F5F9` - Light backgrounds
- `#F8FAFC` - Page backgrounds
- `#FFFFFF` - Cards, modals

### Semantic Colors

**Score Indicators**
- `#10B981` - Qualified (Score >= Required)
- `#F59E0B` - Close (Score within 5 points)
- `#EF4444` - Not Qualified (Score < Required)

**Application Status**
- `#3B82F6` - Applied
- `#8B5CF6` - Under Review
- `#F59E0B` - Interview Scheduled
- `#10B981` - Accepted
- `#EF4444` - Rejected

**Job Status**
- `#10B981` - Active
- `#64748B` - Draft
- `#EF4444` - Closed

---

## Typography

### Font Family

**Primary Font:** Inter (Google Fonts)
- Clean, modern, highly readable
- Excellent for UI and data display
- Supports multiple weights

**Fallback:** System fonts
- `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

### Type Scale

```
Display (Hero):    48px / 56px - Bold (700)
H1 (Page Title):   36px / 44px - Bold (700)
H2 (Section):      30px / 38px - Semi-bold (600)
H3 (Subsection):   24px / 32px - Semi-bold (600)
H4 (Card Title):   20px / 28px - Semi-bold (600)
H5 (Small Title):  18px / 26px - Medium (500)
Body Large:        16px / 24px - Regular (400)
Body (Default):    14px / 20px - Regular (400)
Body Small:        12px / 18px - Regular (400)
Caption:           12px / 16px - Regular (400)
Label:             12px / 16px - Medium (500)
```

### Typography Usage

**Headings:**
- Use for page titles, section headers, card titles
- Maintain consistent hierarchy
- Limit to 3-4 heading levels per page

**Body Text:**
- Default: 14px for most content
- 16px for important descriptions
- 12px for secondary information

**Labels:**
- Form labels, table headers, metadata
- Medium weight (500) for emphasis
- Consistent sizing (12px)

---

## Component Library

### Buttons

#### Primary Button
- **Background:** `#2563EB`
- **Text:** White
- **Padding:** 12px 24px
- **Border Radius:** 8px
- **Font:** 14px Medium
- **Hover:** `#1D4ED8`
- **Active:** `#1E40AF`
- **Disabled:** `#CBD5E1` background, `#94A3B8` text

#### Secondary Button
- **Background:** Transparent
- **Border:** 1px solid `#CBD5E1`
- **Text:** `#1E293B`
- **Padding:** 12px 24px
- **Hover:** `#F8FAFC` background

#### Ghost Button
- **Background:** Transparent
- **Text:** `#2563EB`
- **Padding:** 8px 16px
- **Hover:** `#DBEAFE` background

#### Icon Button
- **Size:** 40px × 40px
- **Border Radius:** 8px
- **Icon:** 20px
- **Hover:** Light background

### Input Fields

#### Text Input
- **Height:** 44px
- **Padding:** 12px 16px
- **Border:** 1px solid `#CBD5E1`
- **Border Radius:** 8px
- **Font:** 14px Regular
- **Focus:** 2px solid `#2563EB` border
- **Placeholder:** `#94A3B8`
- **Error:** Red border (`#EF4444`)

#### Textarea
- **Min Height:** 100px
- **Padding:** 12px 16px
- **Resize:** Vertical only
- Same styling as text input

#### Select Dropdown
- Same styling as text input
- **Dropdown:** White background, shadow level 3
- **Option Hover:** `#F1F5F9`
- **Selected:** `#DBEAFE` background

#### Checkbox/Radio
- **Size:** 20px × 20px
- **Border:** 2px solid `#CBD5E1`
- **Checked:** `#2563EB` background
- **Border Radius:** 4px (checkbox), 50% (radio)

### Cards

#### Default Card
- **Background:** White
- **Padding:** 24px
- **Border Radius:** 12px
- **Shadow:** Level 2
- **Border:** 1px solid `#E2E8F0` (optional)

#### Job Card
- **Padding:** 20px
- **Hover:** Shadow level 3, slight lift
- **Border:** 1px solid `#E2E8F0`
- **Elements:**
  - Company logo (48px × 48px)
  - Job title (H4)
  - Company name (Body, `#64748B`)
  - Location, Type badges
  - Score requirement badge
  - Qualification indicator
  - Apply button

#### Application Card
- Similar to job card
- **Status Badge:** Colored indicator
- **Date:** Small text, `#94A3B8`
- **Quick Actions:** View, Withdraw buttons

### Badges

#### Status Badge
- **Padding:** 6px 12px
- **Border Radius:** 4px
- **Font:** 12px Medium
- **Colors:** Based on status (see Semantic Colors)

#### Score Badge
- **Qualified:** Green background, white text
- **Not Qualified:** Red background, white text
- **Close:** Orange background, white text

#### Tag Badge
- **Background:** `#F1F5F9`
- **Text:** `#475569`
- **Padding:** 4px 8px
- **Border Radius:** 4px
- **Font:** 12px Regular

### Modals

#### Modal Container
- **Background:** White
- **Border Radius:** 16px
- **Padding:** 32px
- **Max Width:** 600px (standard), 800px (wide)
- **Shadow:** Level 5
- **Backdrop:** `rgba(0, 0, 0, 0.5)`

#### Modal Header
- **Title:** H3
- **Close Button:** Icon button, top-right
- **Border Bottom:** 1px solid `#E2E8F0`
- **Padding Bottom:** 16px
- **Margin Bottom:** 24px

#### Modal Footer
- **Border Top:** 1px solid `#E2E8F0`
- **Padding Top:** 16px
- **Margin Top:** 24px
- **Actions:** Right-aligned buttons

### Tables

#### Table Container
- **Background:** White
- **Border:** 1px solid `#E2E8F0`
- **Border Radius:** 12px
- **Overflow:** Hidden

#### Table Header
- **Background:** `#F8FAFC`
- **Padding:** 12px 16px
- **Font:** 12px Medium, `#64748B`
- **Border Bottom:** 1px solid `#E2E8F0`
- **Text:** Uppercase, letter-spacing 0.5px

#### Table Row
- **Padding:** 16px
- **Border Bottom:** 1px solid `#E2E8F0`
- **Hover:** `#F8FAFC` background
- **Last Row:** No border

### Navigation

#### Sidebar Navigation
- **Width:** 256px (desktop), 64px (collapsed)
- **Background:** White
- **Border Right:** 1px solid `#E2E8F0`
- **Padding:** 24px 16px
- **Item Height:** 44px
- **Active:** `#DBEAFE` background, `#2563EB` text
- **Hover:** `#F1F5F9` background

#### Top Navigation
- **Height:** 64px
- **Background:** White
- **Border Bottom:** 1px solid `#E2E8F0`
- **Padding:** 0 24px
- **Elements:** Logo, Search, Notifications, User Menu

### Forms

#### Form Layout
- **Label:** 12px Medium, `#1E293B`, margin-bottom 8px
- **Input:** Full width, margin-bottom 24px
- **Help Text:** 12px Regular, `#64748B`, margin-top 4px
- **Error Text:** 12px Regular, `#EF4444`, margin-top 4px

#### Form Sections
- **Section Title:** H4, margin-bottom 16px
- **Section Description:** Body, `#64748B`, margin-bottom 24px
- **Section Divider:** 1px solid `#E2E8F0`, margin 32px 0

---

## Layout Patterns

### Page Structure

```
┌─────────────────────────────────────┐
│         Top Navigation (64px)        │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │    Main Content Area     │
│ (256px)  │    (Fluid, max 1280px)   │
│          │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

### Dashboard Layout

```
┌─────────────────────────────────────┐
│         Page Header (H1)            │
├─────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌──────┐│
│  │ Stat 1  │  │ Stat 2  │  │Stat 3││
│  └─────────┘  └─────────┘  └──────┘│
├─────────────────────────────────────┤
│         Recent Activity             │
│  ┌────────────────────────────────┐│
│  │  Activity List                  ││
│  └────────────────────────────────┘│
└─────────────────────────────────────┘
```

### List/Grid View

```
┌─────────────────────────────────────┐
│  Filters │ Search │ View Toggle     │
├─────────────────────────────────────┤
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐  │
│  │Card│  │Card│  │Card│  │Card│  │
│  └────┘  └────┘  └────┘  └────┘  │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐  │
│  │Card│  │Card│  │Card│  │Card│  │
│  └────┘  └────┘  └────┘  └────┘  │
├─────────────────────────────────────┤
│         Pagination                  │
└─────────────────────────────────────┘
```

### Detail View

```
┌─────────────────────────────────────┐
│  Breadcrumb Navigation              │
├─────────────────────────────────────┤
│  ┌──────────────────────────────┐ │
│  │  Main Content (Left 2/3)      │ │
│  │  - Title                      │ │
│  │  - Details                    │ │
│  │  - Actions                    │ │
│  └──────────────────────────────┘ │
│  ┌──────────────────────────────┐ │
│  │  Sidebar (Right 1/3)          │ │
│  │  - Quick Info                 │ │
│  │  - Related Items              │ │
│  └──────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## Student Portal UI/UX

### Dashboard

**Layout:**
- Hero section with current score (large, prominent)
- Quick stats cards (4-column grid)
- Recent job listings (3-column grid)
- Application status overview (horizontal cards)

**Score Display:**
- Large circular or rectangular badge
- Score number: 48px Bold
- "Out of 100" text: 14px Regular
- Last updated: 12px, `#94A3B8`
- Score breakdown: Expandable section

**Quick Stats Cards:**
- Icon (24px) + Number (24px Bold) + Label (12px)
- Background: White
- Border: 1px solid `#E2E8F0`
- Hover: Shadow level 2

**Color Coding:**
- Applications: Blue
- Pending: Orange
- Accepted: Green
- Rejected: Red

---

### Job Search Page

**Header:**
- Page title: "Find Your Next Opportunity"
- Search bar: Full width, prominent
- Filter toggle button

**Filters Sidebar:**
- Slide-out panel (320px width)
- Collapsible sections
- Active filter count badge
- "Clear All" button
- "Apply Filters" button

**Search Bar:**
- Large input (56px height)
- Search icon on left
- "Search jobs, companies..." placeholder
- "Advanced Filters" button on right

**Job Cards Grid:**
- 3 columns (desktop), 2 (tablet), 1 (mobile)
- Card height: Auto (min 200px)
- Hover: Lift effect, shadow level 3
- Qualification badge: Top-right corner

**Job Card Elements:**
1. **Header:**
   - Company logo (left, 48px)
   - Qualification badge (right, top)
   - Job title (H4, `#0F172A`)
   - Company name (Body, `#64748B`)

2. **Details:**
   - Location icon + text
   - Job type badge
   - Score requirement: "Min Score: 75"

3. **Qualification Indicator:**
   - Large badge: "Qualified" (green) or "Not Qualified" (red)
   - Your score vs. required: "Your Score: 82 | Required: 75"

4. **Footer:**
   - Posted date (small, `#94A3B8`)
   - "View Details" button (primary)
   - "Apply" button (if qualified, otherwise disabled)

**View Toggle:**
- Grid view (default)
- List view (compact)
- Icons: Grid/List toggle buttons

**Pagination:**
- Bottom center
- Previous/Next buttons
- Page numbers
- "Showing X-Y of Z results"

---

### Job Detail Page

**Layout:**
- Left: Main content (2/3 width)
- Right: Sidebar (1/3 width)

**Main Content:**
1. **Header:**
   - Breadcrumb: Home > Jobs > [Job Title]
   - Job title (H1)
   - Company name + logo
   - Location, Type, Posted date

2. **Score Section (Prominent):**
   - Card with colored background
   - Your Score: Large number (36px)
   - Required Score: Large number (36px)
   - Qualification status: Large badge
   - Visual comparison bar

3. **Job Description:**
   - Section title (H3)
   - Rich text content
   - Line height: 1.6

4. **Requirements:**
   - Bulleted list
   - Icons for each requirement

5. **Responsibilities:**
   - Numbered or bulleted list

6. **Benefits:**
   - Grid of benefit cards
   - Icons + text

**Sidebar:**
1. **Quick Apply Card:**
   - "Apply Now" button (large, primary)
   - Disabled if not qualified
   - Message if not qualified

2. **Job Summary:**
   - Key details in card
   - Location, Type, Salary, etc.

3. **Company Profile:**
   - Company logo
   - Company name
   - Industry
   - "View Company" link

4. **Similar Jobs:**
   - List of 3-5 similar positions
   - Card previews

**Apply Button States:**
- **Qualified:** Primary blue, enabled
- **Not Qualified:** Gray, disabled, with message
- **Hover:** Darker shade
- **Loading:** Spinner, disabled

---

### Application Management

**Tabs:**
- All Applications
- Pending Review
- Interview Scheduled
- Accepted
- Rejected

**Application List:**
- Table view (default) or card view
- Columns: Job, Company, Applied Date, Status, Score, Actions

**Application Card:**
- Job title + company
- Application date
- Status badge (colored)
- Score at application
- "View Details" button

**Application Detail:**
- Similar to job detail layout
- Status timeline (visual)
- Status history
- HR notes (if visible)
- Withdraw button (if applicable)

---

### Student Profile

**Header Section:**
- Profile picture placeholder
- Name
- Email
- Current score (large, prominent)

**Tabs:**
- Overview
- Courses
- Tests
- Certificates
- Achievements
- Skills

**Overview Tab:**
- Score breakdown chart
- Quick stats
- Recent activity

**Courses Tab:**
- List of enrolled courses
- Progress bars
- Completion status

**Tests Tab:**
- Test history table
- Scores, dates, pass/fail

**Certificates Tab:**
- Grid of certificate cards
- Certificate preview
- Download button

---

## HR Portal UI/UX

### HR Dashboard

**Header:**
- Company name + logo
- Welcome message

**Stats Cards:**
- Active Jobs
- Total Applications
- Pending Review
- This Month's Applications

**Recent Activity:**
- Latest applications (table)
- Recent job postings
- Status updates

**Quick Actions:**
- "Post New Job" button (prominent)
- "View All Jobs" link
- "View Applications" link

---

### Create/Edit Job Page

**Form Layout:**
- Multi-step or single page
- Progress indicator (if multi-step)

**Form Sections:**

1. **Basic Information:**
   - Job title (required)
   - Job type (dropdown)
   - Location (with autocomplete)
   - Department

2. **Job Description:**
   - Rich text editor
   - Formatting toolbar
   - Character count

3. **Score Requirements (Critical):**
   - Prominent section
   - "Minimum Required Score" input
   - Number input (0-100)
   - Helper text: "Only students with this score or higher can apply"
   - Visual indicator
   - Optional: Maximum score

4. **Requirements & Qualifications:**
   - Text areas
   - Bullet point formatting

5. **Additional Details:**
   - Salary range (optional)
   - Experience level
   - Application deadline
   - Number of positions

6. **Skills:**
   - Tag input
   - Add/remove skills
   - Required vs. preferred

**Preview Section:**
- Live preview of job listing
- "Preview as Student" button

**Actions:**
- "Save as Draft" (secondary)
- "Publish Job" (primary)
- "Cancel" (ghost)

---

### Applications Management

**Filters:**
- Job posting filter
- Status filter
- Score range filter
- Date range filter
- Search by candidate name

**Applications Table:**
- Columns: Candidate, Job, Score, Applied Date, Status, Actions
- Sortable columns
- Row selection (checkbox)
- Bulk actions

**Application Detail View:**
- Left: Candidate profile
- Right: Application details + actions

**Candidate Profile:**
- Name, email
- Current score (large)
- Score at application
- Academic history tabs
- Download profile button

**Application Actions:**
- Status dropdown
- Add notes (internal)
- Send message (if implemented)
- Schedule interview (if implemented)

**Status Update Modal:**
- Status selection
- Notes field
- Confirmation
- Notification preview

---

## Admin Portal UI/UX

### Admin Dashboard

**Platform Stats:**
- Total Students
- Total Companies
- Active Jobs
- Total Applications
- Growth metrics (charts)

**Pending Actions:**
- Company approval requests (highlighted)
- System alerts
- Recent activity

**Quick Access:**
- Approve Companies
- Manage Users
- View Analytics

---

### Company Approval

**Pending Requests List:**
- Company cards
- Company name, industry, requested date
- "Review" button
- Status badge

**Company Detail View:**
- Full company information
- Contact details
- Business verification
- Request history

**Approval Actions:**
- "Approve" button (green, primary)
- "Reject" button (red, secondary)
- Rejection reason field (if rejecting)
- Confirmation modal

**Approved Companies:**
- Table view
- Status management
- Edit company info
- Suspend/Reactivate

---

## Responsive Design

### Breakpoints

```
Mobile:     320px - 767px
Tablet:     768px - 1023px
Desktop:    1024px - 1279px
Large:      1280px+
```

### Mobile Adaptations

**Navigation:**
- Hamburger menu
- Bottom navigation (optional)
- Collapsible sidebar

**Cards:**
- Full width
- Stacked layout
- Reduced padding

**Tables:**
- Horizontal scroll
- Or card view alternative
- Hidden less important columns

**Forms:**
- Full width inputs
- Stacked layout
- Larger touch targets (44px minimum)

**Modals:**
- Full screen on mobile
- Bottom sheet style (optional)
- Swipe to dismiss

### Tablet Adaptations

**Grid:**
- 2 columns instead of 3
- Adjusted spacing

**Sidebar:**
- Collapsible
- Overlay on mobile

**Forms:**
- 2-column layout where appropriate
- Maintained spacing

---

## Accessibility Guidelines

### Color Contrast

- **Text on Background:** Minimum 4.5:1 ratio
- **Large Text:** Minimum 3:1 ratio
- **Interactive Elements:** Minimum 3:1 ratio

### Keyboard Navigation

- All interactive elements focusable
- Visible focus indicators (2px blue outline)
- Logical tab order
- Skip links for main content

### Screen Readers

- Semantic HTML
- ARIA labels where needed
- Alt text for images
- Form labels associated with inputs
- Status announcements for dynamic content

### Visual Indicators

- Icons paired with text
- Color not sole indicator
- Error states with icons + text
- Success states with icons + text

### Touch Targets

- Minimum 44px × 44px
- Adequate spacing between targets
- No overlapping interactive elements

---

## Animation & Interactions

### Micro-interactions

**Button Hover:**
- Scale: 1.02
- Shadow increase
- Color transition (200ms)

**Card Hover:**
- Lift: translateY(-2px)
- Shadow increase
- Transition: 200ms ease

**Input Focus:**
- Border color change
- Slight scale: 1.01
- Transition: 150ms

**Loading States:**
- Skeleton screens
- Spinner animations
- Progress bars

### Page Transitions

- Fade in: 200ms
- Slide transitions for modals
- Smooth scroll behavior

### Feedback Animations

**Success:**
- Green checkmark animation
- Toast notification (slide in from top)
- Auto-dismiss after 3 seconds

**Error:**
- Red X animation
- Shake animation for forms
- Persistent until fixed

**Loading:**
- Skeleton screens
- Spinner
- Progress indicators

### Transitions

```
Default:     200ms ease
Fast:        150ms ease
Slow:        300ms ease
Bounce:      400ms cubic-bezier
```

---

## Design Assets

### Icons

**Icon Library:** Heroicons or Lucide
**Size:** 20px (default), 24px (large), 16px (small)
**Style:** Outline (default), Solid (active states)
**Color:** Inherit from text color

**Key Icons:**
- Search, Filter, Sort
- Check, X, Alert
- User, Company, Job
- Calendar, Location, Score
- Edit, Delete, View
- Arrow (left, right, up, down)
- Menu, Close, More

### Illustrations

**Empty States:**
- No jobs found
- No applications
- No companies
- Empty search results

**Error States:**
- 404 page
- Server error
- Network error

**Success States:**
- Application submitted
- Job posted
- Company approved

### Images

**Placeholders:**
- Company logos: 48px × 48px, rounded
- Profile pictures: 40px × 40px, circular
- Job thumbnails: 16:9 ratio

**Optimization:**
- WebP format
- Lazy loading
- Responsive images (srcset)

---

## Design Tokens

### Spacing Tokens
```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;
--spacing-2xl: 32px;
--spacing-3xl: 48px;
--spacing-4xl: 64px;
```

### Color Tokens
```css
--color-primary: #2563EB;
--color-success: #10B981;
--color-warning: #F59E0B;
--color-error: #EF4444;
--color-text-primary: #0F172A;
--color-text-secondary: #64748B;
--color-border: #E2E8F0;
--color-background: #F8FAFC;
```

### Typography Tokens
```css
--font-family: 'Inter', sans-serif;
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;
--font-size-xl: 20px;
--font-size-2xl: 24px;
--font-size-3xl: 30px;
--font-size-4xl: 36px;
```

### Shadow Tokens
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 2px 4px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.12);
--shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.15);
--shadow-2xl: 0 16px 32px rgba(0, 0, 0, 0.2);
```

---

## Implementation Notes

### CSS Framework

**Recommended:** Tailwind CSS
- Utility-first approach
- Custom design tokens
- Responsive utilities
- Component classes

### Component Library

**Recommended:** Custom components built on:
- React (if using React)
- Styled-components or CSS Modules
- Design tokens for consistency

### Design Tools

**Design:** Figma
- Component library
- Design system
- Prototypes
- Handoff specifications

**Assets:**
- SVG icons
- Optimized images
- Design specifications

---

## Summary

### Design Principles Recap

1. **Clean & Modern:** Minimalist, purposeful design
2. **Professional:** Trustworthy appearance
3. **User-Centric:** Role-specific, intuitive
4. **Accessible:** WCAG 2.1 AA compliant
5. **Responsive:** Mobile-first approach

### Key Visual Elements

- **Color:** Professional blue primary, semantic colors for status
- **Typography:** Inter font, clear hierarchy
- **Components:** Consistent, reusable, accessible
- **Layout:** Grid-based, responsive, organized
- **Interactions:** Smooth, purposeful, feedback-rich

### Next Steps

1. Create Figma design system
2. Build component library
3. Develop prototypes
4. User testing
5. Iterate based on feedback

---

**Document Status:** Complete UI/UX Design Specification  
**Last Updated:** November 2025  
**Purpose:** Visual and interaction design guidelines for Dakshath platform

---

_This document provides comprehensive UI/UX guidelines for creating a beautiful, clean, and user-friendly interface for the Dakshath platform. All designs should follow these specifications for consistency and quality._

