require('dotenv').config();
const crypto = require('crypto');
const { sequelize } = require('./models');
const { User, Company, HRUser, JobListing, Application, ApplicationStatusHistory, StudentScore, Notification, JobCategory } = require('./models');
const bcrypt = require('bcryptjs');

// Note: User IDs are now INTEGER (auto-increment) to match shared database schema

/**
 * Reset Dakshath Database
 * 
 * This script will:
 * 1. Drop all Dakshath-specific tables (preserving LMS tables like 'users')
 * 2. Run all migrations to recreate tables
 * 3. Seed default data (admin user, sample companies, etc.)
 */

const DAKSHATH_TABLES = [
  'job_categories',
  'notifications',
  'student_scores',
  'application_status_history',
  'applications',
  'job_listings',
  'hr_users',
  'companies'
];

async function dropDakshathTables() {
  console.log('\n🗑️  Dropping Dakshath tables...');
  
  try {
    // Disable foreign key checks temporarily
    await sequelize.query('SET session_replication_role = replica;');
    
    for (const table of DAKSHATH_TABLES) {
      try {
        await sequelize.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
        console.log(`   ✅ Dropped table: ${table}`);
      } catch (error) {
        if (!error.message.includes('does not exist')) {
          console.log(`   ⚠️  Error dropping ${table}: ${error.message}`);
        }
      }
    }
    
    // Re-enable foreign key checks
    await sequelize.query('SET session_replication_role = DEFAULT;');
    
    // Clear SequelizeMeta entries for Dakshath migrations (001-009)
    try {
      await sequelize.query(`
        DELETE FROM "SequelizeMeta" 
        WHERE "name" LIKE '001-%' 
           OR "name" LIKE '002-%' 
           OR "name" LIKE '003-%' 
           OR "name" LIKE '004-%' 
           OR "name" LIKE '005-%' 
           OR "name" LIKE '006-%' 
           OR "name" LIKE '007-%' 
           OR "name" LIKE '008-%' 
           OR "name" LIKE '009-%';
      `);
      console.log('   ✅ Migration history cleared');
    } catch (error) {
      // SequelizeMeta table might not exist yet, that's okay
      console.log('   ℹ️  Migration history will be reset when migrations run');
    }
    
    console.log('   ✅ All Dakshath tables dropped\n');
  } catch (error) {
    console.error('   ❌ Error dropping tables:', error.message);
    throw error;
  }
}

async function runMigrations() {
  console.log('📦 Running migrations...');
  
  const { execSync } = require('child_process');
  
  try {
    // Run migrations
    execSync('npx sequelize-cli db:migrate', {
      cwd: __dirname,
      stdio: 'inherit',
      env: process.env
    });
    
    console.log('   ✅ Migrations completed\n');
  } catch (error) {
    console.error('   ❌ Migration error:', error.message);
    throw error;
  }
}

async function seedDefaultData() {
  console.log('🌱 Seeding default data...\n');
  
  try {
    // 0. Ensure enum values exist (student, hr, admin)
    console.log('   0. Checking/Updating role enum values...');
    try {
      const [enumCheck] = await sequelize.query(`
        SELECT enumlabel 
        FROM pg_enum 
        WHERE enumtypid = (
          SELECT oid 
          FROM pg_type 
          WHERE typname = 'enum_users_role'
        )
        ORDER BY enumsortorder;
      `);
      
      const enumValues = enumCheck.map(row => row.enumlabel);
      console.log('      Current enum values:', enumValues.join(', '));
      
      // Add 'student' to enum if it doesn't exist
      if (!enumValues.includes('student')) {
        try {
          await sequelize.query(`ALTER TYPE "enum_users_role" ADD VALUE 'student';`);
          console.log('      ✅ Added "student" to role enum');
        } catch (addErr) {
          if (addErr.message.includes('already exists')) {
            console.log('      ℹ️  "student" already exists in role enum');
          } else {
            throw addErr;
          }
        }
      } else {
        console.log('      ℹ️  "student" already exists in role enum');
      }
      
      // Add 'hr' to enum if it doesn't exist
      if (!enumValues.includes('hr')) {
        try {
          await sequelize.query(`ALTER TYPE "enum_users_role" ADD VALUE 'hr';`);
          console.log('      ✅ Added "hr" to role enum');
        } catch (addErr) {
          if (addErr.message.includes('already exists')) {
            console.log('      ℹ️  "hr" already exists in role enum');
          } else {
            throw addErr;
          }
        }
      } else {
        console.log('      ℹ️  "hr" already exists in role enum');
      }
    } catch (err) {
      console.log('      ⚠️  Role enum check error:', err.message);
      // Continue anyway - might work if enum already has the values
    }
    
    // 1. Ensure admin user exists (shared with LMS)
    console.log('\n   1. Checking/Creating admin user...');
    let adminUser = await User.findOne({ where: { email: 'admin@lms.com' } });
    
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      adminUser = await User.create({
        name: 'System Administrator',
        email: 'admin@lms.com',
        password: hashedPassword,
        role: 'admin',
        is_active: true
      });
      console.log('      ✅ Admin user created');
    } else {
      // Ensure admin has password
      if (!adminUser.password) {
        const hashedPassword = await bcrypt.hash('admin123', 12);
        await adminUser.update({ password: hashedPassword });
      }
      console.log('      ✅ Admin user exists');
    }
    
    // 1.5. Create default students (shared with LMS)
    console.log('\n   1.5. Creating default students...');
    
    const defaultStudents = [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@student.com',
        password: 'student123',
        role: 'student'
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@student.com',
        password: 'student123',
        role: 'student'
      },
      {
        name: 'Amit Patel',
        email: 'amit.patel@student.com',
        password: 'student123',
        role: 'student'
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@student.com',
        password: 'student123',
        role: 'student'
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@student.com',
        password: 'student123',
        role: 'student'
      },
      {
        name: 'Ananya Desai',
        email: 'ananya.desai@student.com',
        password: 'student123',
        role: 'student'
      },
      {
        name: 'Rohit Mehta',
        email: 'rohit.mehta@student.com',
        password: 'student123',
        role: 'student'
      },
      {
        name: 'Kavya Nair',
        email: 'kavya.nair@student.com',
        password: 'student123',
        role: 'student'
      }
    ];
    
    for (const studentData of defaultStudents) {
      const existingStudent = await User.findOne({ where: { email: studentData.email } });
      
      if (!existingStudent) {
        const hashedPassword = await bcrypt.hash(studentData.password, 12);
        await User.create({
          name: studentData.name,
          email: studentData.email,
          password: hashedPassword,
          role: studentData.role,
          is_active: true
        });
        console.log(`      ✅ Created student: ${studentData.name} (${studentData.email})`);
      } else {
        // Ensure student has password
        if (!existingStudent.password) {
          const hashedPassword = await bcrypt.hash(studentData.password, 12);
          await existingStudent.update({ password: hashedPassword });
        }
        console.log(`      ℹ️  Student exists: ${studentData.name}`);
      }
    }
    
    // 2. Create sample companies
    console.log('\n   2. Creating sample companies...');
    
    const companies = [
      {
        company_name: 'TechCorp Solutions',
        email: 'hr@techcorp.com',
        description: 'Leading technology solutions provider specializing in software development and cloud services.',
        website: 'https://www.techcorp.com',
        industry: 'Technology',
        location: 'Bangalore, India',
        phone: '+91-80-1234-5678',
        status: 'active',
        approved_by: adminUser.id,
        approved_at: new Date()
      },
      {
        company_name: 'DataAnalytics Inc',
        email: 'careers@dataanalytics.com',
        description: 'Data analytics and business intelligence company helping organizations make data-driven decisions.',
        website: 'https://www.dataanalytics.com',
        industry: 'Data & Analytics',
        location: 'Mumbai, India',
        phone: '+91-22-9876-5432',
        status: 'active',
        approved_by: adminUser.id,
        approved_at: new Date()
      },
      {
        company_name: 'StartupHub',
        email: 'jobs@startuphub.com',
        description: 'Innovative startup focused on building next-generation web applications.',
        website: 'https://www.startuphub.com',
        industry: 'Technology',
        location: 'Hyderabad, India',
        phone: '+91-40-5555-1234',
        status: 'pending'
      }
    ];
    
    const createdCompanies = [];
    for (const companyData of companies) {
      const [company, created] = await Company.findOrCreate({
        where: { company_name: companyData.company_name },
        defaults: companyData
      });
      createdCompanies.push(company);
      console.log(`      ${created ? '✅ Created' : 'ℹ️  Exists'}: ${company.company_name}`);
    }
    
    // 3. Create HR users for active companies
    console.log('\n   3. Creating HR users for companies...');
    
    for (const company of createdCompanies.filter(c => c.status === 'active')) {
      const hrEmail = company.email;
      let hrUser = await User.findOne({ where: { email: hrEmail } });
      
      if (!hrUser) {
        const hashedPassword = await bcrypt.hash('hr123456', 12);
        hrUser = await User.create({
          name: `HR Manager - ${company.company_name}`,
          email: hrEmail,
          password: hashedPassword,
          role: 'hr',
          is_active: true
        });
        
        await HRUser.create({
          user_id: hrUser.id,
          company_id: company.id,
          is_active: true
        });
        
        console.log(`      ✅ Created HR user: ${hrEmail} (password: hr123456)`);
      } else {
        console.log(`      ℹ️  HR user exists: ${hrEmail}`);
      }
    }
    
    // 4. Create job categories
    console.log('\n   4. Creating job categories...');
    
    const categories = [
      { name: 'Software Development', description: 'Software engineering and development roles' },
      { name: 'Data Science', description: 'Data analysis, machine learning, and AI roles' },
      { name: 'Web Development', description: 'Frontend and backend web development' },
      { name: 'Mobile Development', description: 'iOS and Android app development' },
      { name: 'DevOps', description: 'Infrastructure and deployment engineering' },
      { name: 'QA/Testing', description: 'Quality assurance and testing roles' },
      { name: 'UI/UX Design', description: 'User interface and experience design' },
      { name: 'Product Management', description: 'Product strategy and management' },
      { name: 'Internship', description: 'Internship opportunities for students' }
    ];
    
    for (const category of categories) {
      const [cat, created] = await JobCategory.findOrCreate({
        where: { name: category.name },
        defaults: category
      });
      console.log(`      ${created ? '✅ Created' : 'ℹ️  Exists'}: ${category.name}`);
    }
    
    // 5. Create sample job listings (for active companies)
    console.log('\n   5. Creating sample job listings...');
    
    const activeCompanies = createdCompanies.filter(c => c.status === 'active');
    if (activeCompanies.length > 0) {
      const hrUsers = await HRUser.findAll({
        where: { company_id: activeCompanies[0].id, is_active: true },
        include: [{ association: 'user' }]
      });
      
      if (hrUsers.length > 0) {
            const jobs = [
          {
            company_id: activeCompanies[0].id,
            posted_by: hrUsers[0].id,
            title: 'Full Stack Developer',
            description: 'We are looking for an experienced Full Stack Developer to join our team. You will be responsible for developing and maintaining web applications using modern technologies.',
            job_type: 'full-time',
            location: 'Bangalore, India',
            required_score_min: 70.00,
            status: 'active'
          },
          {
            company_id: activeCompanies[0].id,
            posted_by: hrUsers[0].id,
            title: 'Data Science Intern',
            description: 'Internship opportunity for students interested in data science and machine learning. Work on real-world projects and learn from experienced data scientists.',
            job_type: 'internship',
            location: 'Remote',
            required_score_min: 60.00,
            status: 'active'
          }
        ];
        
        for (const jobData of jobs) {
          const [job, created] = await JobListing.findOrCreate({
            where: {
              company_id: jobData.company_id,
              title: jobData.title
            },
            defaults: jobData
          });
          console.log(`      ${created ? '✅ Created' : 'ℹ️  Exists'}: ${job.title}`);
        }
      }
    }
    
    console.log('\n✅ Seeding completed successfully!\n');
    
    // Print summary
    console.log('📊 Summary:');
    console.log('   - Admin User: admin@lms.com / admin123');
    console.log('   - Students: ' + defaultStudents.length + ' default students (password: student123)');
    console.log('   - HR Users: Check company emails (password: hr123456)');
    console.log('   - Companies: ' + createdCompanies.length);
    console.log('   - Job Categories: ' + categories.length);
    console.log('   - Sample Jobs: Created for active companies\n');
    
  } catch (error) {
    console.error('   ❌ Seeding error:', error.message);
    throw error;
  }
}

async function resetDatabase() {
  try {
    console.log('🚀 Starting Dakshath Database Reset...\n');
    console.log('⚠️  WARNING: This will delete all Dakshath data!');
    console.log('   (LMS tables like "users" will be preserved)\n');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');
    
    // Step 1: Drop tables
    await dropDakshathTables();
    
    // Step 2: Run migrations
    await runMigrations();
    
    // Step 3: Seed data
    await seedDefaultData();
    
    console.log('🎉 Database reset completed successfully!');
    console.log('\nYou can now:');
    console.log('   - Login as admin: admin@lms.com / admin123');
    console.log('   - Login as student: Use any student email / student123');
    console.log('   - Login as HR: Use company email / hr123456');
    console.log('   - Register new companies through the registration page\n');
    console.log('📝 Default Student Credentials:');
    console.log('   - rajesh.kumar@student.com / student123');
    console.log('   - priya.sharma@student.com / student123');
    console.log('   - amit.patel@student.com / student123');
    console.log('   - sneha.reddy@student.com / student123');
    console.log('   - vikram.singh@student.com / student123');
    console.log('   - ananya.desai@student.com / student123');
    console.log('   - rohit.mehta@student.com / student123');
    console.log('   - kavya.nair@student.com / student123\n');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Reset failed:', error);
    console.error(error.stack);
    await sequelize.close();
    process.exit(1);
  }
}

// Run the reset
resetDatabase();

