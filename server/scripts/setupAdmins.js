const bcrypt = require('bcryptjs');
const { Admin, sequelize } = require('../models');

async function setupAdminAccounts() {
  try {
    console.log('🔧 Setting up admin accounts...');

    // Sync the Admin model with the database
    await Admin.sync({ alter: true });
    console.log('✅ Admin table synced successfully');

    // Check if super admin already exists
    const existingSuperAdmin = await Admin.findOne({
      where: { email: 'admin@marriageapp.com' }
    });

    if (existingSuperAdmin) {
      console.log('⚠️ Super admin already exists');
      console.log('Email:', existingSuperAdmin.email);
      console.log('Role:', existingSuperAdmin.role);
    } else {
      // Create default super admin
      const superAdmin = await Admin.create({
        name: 'Super Administrator',
        email: 'admin@marriageapp.com',
        password: 'SuperAdmin@123',
        role: 'super_admin',
        phone_number: '+1234567890',
        is_active: true
      });

      console.log('✅ Super admin created successfully');
      console.log('Email: admin@marriageapp.com');
      console.log('Password: SuperAdmin@123');
      console.log('Role:', superAdmin.role);
    }

    // Check if sub-admin already exists
    const existingSubAdmin = await Admin.findOne({
      where: { email: 'subadmin@marriageapp.com' }
    });

    if (existingSubAdmin) {
      console.log('⚠️ Sub admin already exists');
      console.log('Email:', existingSubAdmin.email);
      console.log('Role:', existingSubAdmin.role);
    } else {
      // Get super admin to set as creator
      const superAdmin = await Admin.findOne({
        where: { role: 'super_admin' }
      });

      // Create demo sub-admin
      const subAdmin = await Admin.create({
        name: 'Sub Administrator',
        email: 'subadmin@marriageapp.com',
        password: 'SubAdmin@123',
        role: 'sub_admin',
        phone_number: '+9876543210',
        is_active: true,
        created_by: superAdmin ? superAdmin.id : null,
        permissions: {
          manage_users: true,
          manage_profiles: true,
          manage_payments: true,
          manage_content: true,
          manage_rr: true,
          manage_admins: false,
          view_analytics: true,
          manage_plans: false,
          manage_proposals: true
        }
      });

      console.log('✅ Sub admin created successfully');
      console.log('Email: subadmin@marriageapp.com');
      console.log('Password: SubAdmin@123');
      console.log('Role:', subAdmin.role);
    }

    console.log('\n📋 Admin Accounts Summary:');
    console.log('==========================================');
    
    const allAdmins = await Admin.findAll({
      attributes: ['id', 'name', 'email', 'role', 'is_active', 'created_at']
    });

    allAdmins.forEach(admin => {
      console.log(`\nID: ${admin.id}`);
      console.log(`Name: ${admin.name}`);
      console.log(`Email: ${admin.email}`);
      console.log(`Role: ${admin.role}`);
      console.log(`Active: ${admin.is_active}`);
      console.log(`Created: ${admin.created_at}`);
    });

    console.log('\n==========================================');
    console.log('✅ Admin setup completed successfully!');
    console.log('\n🔐 Default Credentials:');
    console.log('Super Admin: admin@marriageapp.com / SuperAdmin@123');
    console.log('Sub Admin: subadmin@marriageapp.com / SubAdmin@123');
    console.log('\n⚠️ IMPORTANT: Change these passwords after first login!');

  } catch (error) {
    console.error('❌ Error setting up admin accounts:', error);
    throw error;
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupAdminAccounts()
    .then(() => {
      console.log('\n✅ Setup complete. Exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = setupAdminAccounts;
