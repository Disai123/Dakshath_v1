# Default Credentials for Dakshath

## Overview

Dakshath shares the same database and user table as the LMS system. Therefore, user credentials are shared between both platforms.

## Default Admin Credentials

**Note:** These credentials are from the LMS setup. If you haven't run the LMS setup, you may need to create an admin user first.

### Primary Admin Account
- **Email:** `admin@lms.com`
- **Password:** `admin123`
- **Role:** Admin
- **Access:** Both LMS and Dakshath

### Alternative Admin Account (Fallback)
- **Email:** `admin@aishani.com`
- **Password:** `admin123`
- **Role:** Admin
- **Access:** Both LMS and Dakshath

**⚠️ IMPORTANT:** Change the default admin password immediately after first login for security!

## Student Credentials

Students use their **LMS account credentials** to login to Dakshath:

- **Login Method:** Email/Password (same as LMS) or Google OAuth
- **Email:** Their LMS registered email
- **Password:** Their LMS password
- **Role:** Student

**Note:** Students must already have an account in the LMS system. They cannot create new accounts through Dakshath.

## HR User Credentials

HR users are created through **public company registration** (similar to Naukri/Foundit). There are **no default HR credentials**.

### Registration Process:

1. **Company Registration** (Public - No login required):
   - Visit `/register/company` or click "Register Company" on landing page
   - Fill company details and create primary HR user account
   - Submit registration (status: `pending`)

2. **Admin Approval**:
   - Admin reviews and approves/rejects the company
   - If approved, company status changes to `active`
   - HR user receives notification

3. **HR Login** (After approval):
   - Go to `/login` and select "HR" tab
   - Use email and password from registration
   - Access HR dashboard

**HR Login:**
- **Login Method:** Email/Password only (Google OAuth is not available for HR)
- **Email:** Email used during company registration
- **Password:** Password set during company registration

**Note:** HR users cannot login until their company is approved by admin. If company status is `pending`, `rejected`, or `suspended`, login will be blocked.

## Creating Users

### Creating Admin User (if none exists)

If no admin user exists, you can create one using the LMS setup script or manually:

```bash
# Option 1: Run LMS setup script
cd ../backend
node setup-fresh-database.js

# Option 2: Create manually via database
# Insert into users table with:
# - email: 'admin@lms.com'
# - password: (bcrypt hash of 'admin123')
# - role: 'admin'
# - is_active: true
```

### Creating HR User

1. Login as admin
2. Navigate to Admin Dashboard → Companies
3. Create or approve a company
4. Navigate to Admin Dashboard → Users
5. Create new user with:
   - Email: HR user's email
   - Password: Temporary password
   - Role: HR
   - Assign to company

### Student Accounts

Student accounts are created through the LMS system, not Dakshath. Students use their existing LMS credentials to access Dakshath.

## Security Best Practices

1. **Change Default Passwords:** Always change default admin passwords immediately
2. **Strong Passwords:** Enforce strong password policies
3. **Regular Updates:** Regularly update passwords for all accounts
4. **Limit Admin Access:** Only grant admin role to trusted users
5. **Monitor Logins:** Regularly review login activity

## Troubleshooting

### Cannot Login as Admin

1. Verify the admin user exists in the database:
   ```sql
   SELECT * FROM users WHERE role = 'admin';
   ```

2. Check if the user is active:
   ```sql
   SELECT * FROM users WHERE email = 'admin@lms.com' AND is_active = true;
   ```

3. If user doesn't exist, create one using the methods above

### Student Cannot Login

1. Verify student account exists in LMS
2. Verify student has `role = 'student'` in users table
3. Verify student account is active (`is_active = true`)
4. Verify student has a password set (or can use Google OAuth)

### HR Cannot Login

1. Verify HR user exists and is assigned to a company
2. Verify company status is 'active'
3. Verify HR user account is active
4. Contact admin to reset password if needed

## Environment Variables

Make sure your `.env` file has the correct database configuration to access the shared database:

```env
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=lms_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

## Support

For issues with credentials or account access, contact the system administrator.

