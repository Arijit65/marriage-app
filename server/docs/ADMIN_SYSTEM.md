# Admin Authentication System

This document describes the admin authentication system for the Marriage App.

## Overview

The admin system supports two types of admin roles:
- **Super Admin**: Full access to all features including admin management
- **Sub Admin**: Limited access based on assigned permissions

## Setup

### 1. Create Admin Table

Run the setup script to create the admin table and default accounts:

```bash
cd server
node scripts/setupAdmins.js
```

This will create:
- Super Admin account: `admin@marriageapp.com` / `SuperAdmin@123`
- Sub Admin account: `subadmin@marriageapp.com` / `SubAdmin@123`

**⚠️ IMPORTANT**: Change these default passwords after first login!

### 2. Database Migration (Alternative)

If you prefer SQL migration:

```bash
# Execute the SQL file
mysql -u your_username -p your_database < server/migrations/create_admins_table.sql
```

## API Endpoints

### Public Endpoints

#### Admin Login
```
POST /api/v1/admin/login

Body:
{
  "email": "admin@marriageapp.com",
  "password": "SuperAdmin@123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "id": 1,
      "name": "Super Administrator",
      "email": "admin@marriageapp.com",
      "role": "super_admin",
      "permissions": {...},
      "is_active": true,
      "last_login": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Protected Endpoints (Require Admin Authentication)

All protected endpoints require the `Authorization` header:
```
Authorization: Bearer <admin_token>
```

#### Get Admin Profile
```
GET /api/v1/admin/profile
```

#### Update Admin Profile
```
PUT /api/v1/admin/profile

Body:
{
  "name": "Updated Name",
  "phone_number": "+1234567890",
  "profile_info": {
    "avatar": "url",
    "department": "IT"
  }
}
```

#### Change Password
```
PUT /api/v1/admin/change-password

Body:
{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewPassword@123"
}
```

#### Logout
```
POST /api/v1/admin/logout
```

### Super Admin Only Endpoints

#### Create Admin
```
POST /api/v1/admin/create

Body:
{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "password": "Password@123",
  "role": "sub_admin",
  "phone_number": "+1234567890",
  "permissions": {
    "manage_users": true,
    "manage_profiles": true,
    "manage_payments": false,
    "manage_content": true,
    "manage_rr": false,
    "manage_admins": false,
    "view_analytics": true,
    "manage_plans": false,
    "manage_proposals": true
  }
}
```

#### Get All Admins
```
GET /api/v1/admin/list?role=sub_admin&is_active=true
```

#### Update Admin
```
PUT /api/v1/admin/:adminId

Body:
{
  "name": "Updated Name",
  "role": "sub_admin",
  "is_active": true,
  "permissions": {...}
}
```

#### Delete Admin
```
DELETE /api/v1/admin/:adminId
```

## Admin Permissions

Sub-admins can have the following permissions:

| Permission | Description |
|------------|-------------|
| `manage_users` | Manage user accounts |
| `manage_profiles` | Manage user profiles |
| `manage_payments` | View and manage payments |
| `manage_content` | Manage site content |
| `manage_rr` | Manage RR (Relationship Representatives) |
| `manage_admins` | Create/edit/delete other admins (Super Admin only) |
| `view_analytics` | View analytics and reports |
| `manage_plans` | Manage subscription plans |
| `manage_proposals` | Manage marriage proposals |

**Note**: Super admins always have all permissions regardless of the permissions field.

## Security Features

### Account Locking
- After 5 failed login attempts, the account is locked for 30 minutes
- Login attempts counter resets on successful login

### Password Requirements
- Minimum 6 characters
- Passwords are hashed using bcrypt with 12 salt rounds

### Token Security
- JWT tokens with 24-hour expiration
- Tokens include admin type identifier for additional validation

### Role-Based Access Control
- Super admins have full access
- Sub-admins are restricted by permissions
- Middleware enforces role and permission checks

## Admin Roles

### Super Admin
- Full system access
- Can create, edit, and delete other admins
- Can promote/demote admin roles
- Cannot be deleted if they're the last super admin
- Cannot delete or demote themselves

### Sub Admin
- Access based on assigned permissions
- Cannot manage other admins
- Cannot change their own role
- Can be created, edited, or deleted by super admins

## Frontend Integration

The frontend uses the admin authentication through:

1. **AdminAuth Component** (`client/src/pages/Auth/AdminAuth.jsx`)
   - Login form for admin authentication
   - Calls `/api/v1/admin/login` endpoint
   - Stores admin data and token in context and localStorage

2. **AuthContext** (`client/src/context/AuthContext.jsx`)
   - Manages admin authentication state
   - Provides `adminLogin()`, `adminLogout()` functions
   - Syncs state with localStorage

3. **ProtectedRoute** (`client/src/pages/Routes/ProtectedRoutes.jsx`)
   - Validates admin authentication for protected routes
   - Checks for admin token and user data
   - Redirects to login if not authenticated

## Usage Examples

### Creating a Super Admin via Code

```javascript
const { Admin } = require('./models');

const superAdmin = await Admin.create({
  name: 'New Super Admin',
  email: 'superadmin@example.com',
  password: 'SecurePassword@123',
  role: 'super_admin',
  is_active: true
});
```

### Creating a Sub Admin via API

```javascript
// As a logged-in super admin
const response = await fetch('http://localhost:5000/api/v1/admin/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${superAdminToken}`
  },
  body: JSON.stringify({
    name: 'Content Manager',
    email: 'content@example.com',
    password: 'Password@123',
    role: 'sub_admin',
    permissions: {
      manage_content: true,
      view_analytics: true,
      manage_users: false,
      manage_profiles: false
    }
  })
});
```

### Checking Admin Permissions

```javascript
// In your controller
const { requireAdminPermission } = require('../middleware/auth');

router.post('/content', 
  authenticateAdmin, 
  requireAdminPermission('manage_content'),
  contentController.create
);
```

## Troubleshooting

### Cannot login
- Verify credentials are correct
- Check if account is active (`is_active = true`)
- Check if account is locked (`locked_until`)
- Verify database connection

### Permission denied errors
- Check admin role (super_admin vs sub_admin)
- Verify permissions in the admin record
- Ensure using correct authentication middleware

### Token issues
- Verify JWT_SECRET is set in environment variables
- Check token expiration (default 24h)
- Ensure token is sent in Authorization header

## Best Practices

1. **Always change default passwords** after first setup
2. **Use strong passwords** for admin accounts
3. **Regularly audit** admin accounts and permissions
4. **Remove inactive** admin accounts
5. **Use super admin** accounts sparingly
6. **Grant minimum required** permissions to sub-admins
7. **Monitor login attempts** for suspicious activity
8. **Keep admin credentials** secure and confidential

## Environment Variables

Add to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=24h
```

## Support

For issues or questions about the admin system, contact the development team.
