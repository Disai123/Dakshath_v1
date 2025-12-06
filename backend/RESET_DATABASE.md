# Dakshath Database Reset Script

This script will completely reset all Dakshath-related database tables and seed them with default data.

## ⚠️ Warning

**This script will DELETE all Dakshath data including:**
- Companies
- HR Users
- Job Listings
- Applications
- Notifications
- Student Scores
- Job Categories

**It will NOT delete:**
- LMS tables (like `users`, `courses`, etc.)
- Existing student data in the `users` table

## Usage

### Option 1: Using npm script (Recommended)

```bash
cd Dakshath/backend
npm run reset:db
```

### Option 2: Direct execution

```bash
cd Dakshath/backend
node reset-dakshath-database.js
```

## What the Script Does

1. **Drops all Dakshath tables** in the correct order (respecting foreign keys)
2. **Runs all migrations** to recreate tables with proper schema
3. **Seeds default data:**
   - Admin user (if not exists): `admin@lms.com` / `admin123`
   - Sample companies (3 companies: 2 active, 1 pending)
   - HR users for active companies (password: `hr123456`)
   - Job categories (9 categories)
   - Sample job listings (2 jobs for testing)

## Default Credentials

After running the script, you can use:

### Admin Login
- **Email:** `admin@lms.com`
- **Password:** `admin123`

### HR Login (for active companies)
- **TechCorp Solutions:**
  - Email: `hr@techcorp.com`
  - Password: `hr123456`
  
- **DataAnalytics Inc:**
  - Email: `careers@dataanalytics.com`
  - Password: `hr123456`

## Sample Data Created

### Companies
1. **TechCorp Solutions** (Active) - Bangalore, India
2. **DataAnalytics Inc** (Active) - Mumbai, India
3. **StartupHub** (Pending) - Hyderabad, India

### Job Categories
- Software Development
- Data Science
- Web Development
- Mobile Development
- DevOps
- QA/Testing
- UI/UX Design
- Product Management
- Internship

### Sample Jobs
- Full Stack Developer (TechCorp Solutions)
- Data Science Intern (TechCorp Solutions)

## Troubleshooting

### Error: "Cannot find module 'uuid'"
```bash
cd Dakshath/backend
npm install uuid
```

### Error: "Database connection failed"
- Check your `.env` file has correct database credentials
- Ensure PostgreSQL is running
- Verify database name matches your configuration

### Error: "Foreign key constraint"
- The script handles foreign keys automatically
- If you still get errors, try running migrations manually first:
  ```bash
  npm run migrate
  ```

## Notes

- The script uses `findOrCreate` for seeding, so running it multiple times won't create duplicates
- Existing admin users won't be overwritten (password will be updated if missing)
- LMS student data in the `users` table is preserved
- The script automatically handles UUID generation for new users

