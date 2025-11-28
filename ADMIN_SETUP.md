# Admin System - Quick Setup Guide

## 🚀 Quick Start

Follow these steps to set up the admin authentication system:

### Step 1: Setup Admin Database

Run the setup script to create the admin table and default accounts:

```bash
cd server
node scripts/setupAdmins.js
```

**Default Accounts Created:**
- **Super Admin**: `admin@marriageapp.com` / `SuperAdmin@123`
- **Sub Admin**: `subadmin@marriageapp.com` / `SubAdmin@123`

### Step 2: Start the Server

```bash
cd server
npm run dev
```

### Step 3: Start the Client

```bash
cd client
npm run dev
```

### Step 4: Test Admin Login

1. Navigate to: `http://localhost:5173/admin-login`
2. Login with:
   - **Email**: `admin@marriageapp.com`
   - **Password**: `SuperAdmin@123`
3. You'll be redirected to the admin panel

## 📋 API Endpoints

### Login
```bash
POST http://localhost:5000/api/v1/admin/login
Content-Type: application/json

{
  "email": "admin@marriageapp.com",
  "password": "SuperAdmin@123"
}
```

### Get Profile (Protected)
```bash
GET http://localhost:5000/api/v1/admin/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

### Create New Admin (Super Admin Only)
```bash
POST http://localhost:5000/api/v1/admin/create
Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN
Content-Type: application/json

{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "password": "SecurePassword@123",
  "role": "sub_admin",
  "permissions": {
    "manage_users": true,
    "manage_profiles": true,
    "manage_content": true
  }
}
```

## 🔐 Admin Roles

### Super Admin
- ✅ Full system access
- ✅ Can manage other admins
- ✅ Can create/edit/delete admins
- ✅ All permissions enabled

### Sub Admin
- ✅ Limited access based on permissions
- ❌ Cannot manage other admins
- ✅ Can be customized per admin

## 🛡️ Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **Account Locking**: 5 failed attempts = 30 min lock
- **JWT Tokens**: 24-hour expiration
- **Role-Based Access**: Middleware enforcement
- **Permission System**: Granular access control

## 📝 Testing with Postman/Thunder Client

1. **Login**:
   ```
   POST http://localhost:5000/api/v1/admin/login
   ```
   Copy the `token` from response

2. **Use Token**:
   ```
   GET http://localhost:5000/api/v1/admin/profile
   Header: Authorization: Bearer <paste_token_here>
   ```

## ⚠️ Important Notes

1. **Change default passwords** immediately after first login
2. Admin tokens are stored in localStorage and context
3. Protected routes check for admin authentication
4. Super admin cannot be deleted if they're the last one
5. Admin accounts can be locked after failed login attempts

## 🔧 Troubleshooting

### "Admin not found" error
- Run the setup script: `node scripts/setupAdmins.js`
- Check database connection in `config/config.js`

### "Permission denied" error
- Verify you're using super admin account for admin management
- Check admin role in database

### Token expired
- Login again to get a new token
- Tokens last 24 hours by default

## 📚 Full Documentation

See `server/docs/ADMIN_SYSTEM.md` for complete documentation.

## 🎯 Next Steps

1. ✅ Run setup script
2. ✅ Login with default super admin
3. ✅ Change default password
4. ✅ Create additional admins as needed
5. ✅ Configure permissions for sub-admins
6. ✅ Start managing the application!

---

**Need Help?** Check the full documentation or contact the development team.
