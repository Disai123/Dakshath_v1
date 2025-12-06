# HR Registration and Login Process

## Overview

Dakshath follows a company registration model similar to job portals like Naukri, Foundit, etc. Companies register publicly, get approved by admin, and then HR users can login.

## Registration Flow

### Step 1: Company Registration (Public - No Login Required)

1. **Navigate to Registration Page**
   - Go to the landing page (`/`)
   - Click "Register Company" button
   - Or directly visit `/register/company`

2. **Fill Company Information**
   - Company Name (required)
   - Company Description
   - Website URL
   - Industry
   - Location
   - Phone Number
   - Employee Count

3. **Create Primary HR User Account**
   - Full Name (required)
   - Email (required) - This will be your login email
   - Phone Number (optional)
   - Password (required, minimum 6 characters)
   - Confirm Password (required)

4. **Submit Registration**
   - Accept Terms and Conditions
   - Click "Register Company"
   - Company status is set to `pending`

### Step 2: Admin Approval

1. **Admin Reviews Registration**
   - Admin receives notification about new company registration
   - Admin logs into admin dashboard
   - Navigates to "Companies" → "Pending Approvals"
   - Reviews company details

2. **Admin Actions**
   - **Approve**: Company status changes to `active`
     - HR user receives notification
     - HR user can now login
   - **Reject**: Company status changes to `rejected`
     - Admin provides rejection reason
     - HR user receives notification with reason

### Step 3: HR Login (After Approval)

1. **Navigate to Login Page**
   - Go to `/login`
   - Select "HR" tab

2. **Enter Credentials**
   - Email: The email used during registration
   - Password: The password set during registration

3. **Access HR Dashboard**
   - Once logged in, HR can:
     - Post job listings
     - Manage applications
     - View company profile
     - Add more HR users (if permissions allow)

## Complete Process Diagram

```
Company Registration Flow:
┌─────────────────────┐
│  Company Visits     │
│  Landing Page       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Clicks "Register   │
│  Company"           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Fills Registration │
│  Form (Company +    │
│  HR User Details)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Submits Form       │
│  Status: PENDING    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Admin Notified     │
│  (Notification)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Admin Reviews      │
│  Company Details    │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐  ┌─────────┐
│ APPROVE │  │ REJECT  │
└────┬────┘  └────┬────┘
     │            │
     │            ▼
     │      ┌──────────────────┐
     │      │ Status: REJECTED │
     │      │ HR Notified      │
     │      └──────────────────┘
     │
     ▼
┌──────────────────┐
│ Status: ACTIVE   │
│ HR Can Login     │
│ HR Notified      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ HR Logs In       │
│ (Email/Password) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ HR Dashboard     │
│ - Post Jobs      │
│ - Manage Apps    │
│ - View Profile   │
└──────────────────┘
```

## Key Features

### 1. Public Registration
- No authentication required to register
- Anyone can register their company
- Similar to Naukri/Foundit model

### 2. Admin Approval System
- All companies start with `pending` status
- Admin must approve before HR can login
- Prevents spam and ensures quality

### 3. Primary HR User
- First HR user is created during registration
- This user can login after approval
- Additional HR users can be added later by admin or primary HR

### 4. Email Notifications
- Admin notified of new registrations
- HR notified when company is approved/rejected
- Keeps all parties informed

## Login Process for HR

### For Newly Registered Companies

1. **Wait for Approval**
   - After registration, company status is `pending`
   - HR cannot login until admin approves
   - HR will receive email notification upon approval

2. **Login After Approval**
   - Go to `/login`
   - Select "HR" tab
   - Enter email and password from registration
   - Access HR dashboard

### For Existing HR Users

1. **Direct Login**
   - Go to `/login`
   - Select "HR" tab
   - Enter credentials
   - Access dashboard

### Login Restrictions

- **Pending Companies**: HR users cannot login (company not approved)
- **Rejected Companies**: HR users cannot login (company rejected)
- **Suspended Companies**: HR users cannot login (company suspended)
- **Active Companies**: HR users can login normally

## Troubleshooting

### Cannot Login After Registration

**Issue**: Registered but cannot login

**Solutions**:
1. Check if company is approved:
   - Contact admin to check company status
   - Company must be `active` to login

2. Verify credentials:
   - Ensure email and password are correct
   - Check for typos in email

3. Check account status:
   - Ensure HR user account is active
   - Contact admin if account is inactive

### Company Not Approved

**Issue**: Registration submitted but no response

**Solutions**:
1. Wait for admin review (usually 24-48 hours)
2. Contact admin directly
3. Check email for approval/rejection notification

### Forgot Password

**Issue**: Cannot remember password

**Solutions**:
1. Contact admin to reset password
2. Admin can update HR user password
3. (Future: Password reset functionality)

## API Endpoints

### Public Endpoints (No Auth)

- `POST /api/companies/register` - Register new company

### Protected Endpoints (Require Auth)

- `GET /api/companies/hr/profile` - Get company profile (HR)
- `PUT /api/companies/hr/profile` - Update company profile (HR)
- `POST /api/auth/login/hr` - HR login

### Admin Endpoints

- `GET /api/companies/admin/pending` - Get pending companies
- `GET /api/companies/admin/all` - Get all companies
- `POST /api/companies/admin/:id/approve` - Approve company
- `POST /api/companies/admin/:id/reject` - Reject company

## Security Considerations

1. **Email Validation**: All emails are validated during registration
2. **Password Strength**: Minimum 6 characters required
3. **Unique Constraints**: 
   - Company name must be unique
   - HR email must be unique
4. **Admin Approval**: Prevents unauthorized company registrations
5. **Status Checks**: Login blocked for non-active companies

## Future Enhancements

- Email verification for HR users
- Password reset functionality
- Multiple HR users per company
- HR user roles (HR, HR Manager)
- Company profile verification badges
- Bulk company import

