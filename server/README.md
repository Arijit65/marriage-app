# Marriage App Backend

A comprehensive backend API for a matrimonial application built with Node.js, Express, and MySQL using Sequelize ORM.

## 🚀 Features

### Core Features
- **User Authentication & Authorization** - JWT-based authentication with role-based access control
- **OTP Verification** - Mobile-based OTP verification using Twilio
- **Profile Management** - Comprehensive user profiles with completion tracking
- **Proposal System** - Advanced proposal management with status tracking
- **Scoring System** - Profile scoring and ranking algorithms
- **Qualifications & Marks** - Educational and professional qualification tracking
- **Advertisement System** - Matrimonial ads with visibility controls
- **Plan Management** - Tier-based subscription plans with feature restrictions

### Advanced Features
- **Real-time Scoring** - Dynamic profile scoring based on activity and completion
- **Activity Tracking** - Comprehensive user activity monitoring
- **Automated Tasks** - Scheduled jobs for maintenance and analytics
- **Rate Limiting** - Advanced rate limiting and security measures
- **Logging & Monitoring** - Structured logging with Winston
- **Error Handling** - Comprehensive error handling and validation
- **Database Optimization** - Indexed queries and optimized relationships

## 🏗️ Architecture

### Database Models

#### Core Models
- **User** - User accounts with authentication and profile data
- **Profile** - Detailed matrimonial profiles with preferences
- **Proposal** - Marriage proposals with status tracking
- **ProfileScore** - User scoring and ranking system
- **QualificationsMarks** - Educational and professional qualifications
- **Plan** - Subscription plans and features
- **Ad** - Matrimonial advertisements
- **OTP** - One-time password management
- **UserActivity** - User engagement tracking

#### Relationships
```
User (1) ←→ (1) Profile
User (1) ←→ (1) ProfileScore
User (1) ←→ (1) QualificationsMarks
User (1) ←→ (1) Plan
User (1) ←→ (many) Proposal (as proposer)
User (1) ←→ (many) Proposal (as proposed)
User (1) ←→ (many) Ad
User (1) ←→ (many) UserActivity
User (1) ←→ (many) OTP
```

### Services
- **OTP Service** - Mobile verification using Twilio
- **Scheduler Service** - Automated task management
- **Authentication Service** - JWT token management
- **Scoring Service** - Profile ranking algorithms

### Middleware
- **Authentication** - JWT verification and user authorization
- **Error Handling** - Comprehensive error management
- **Rate Limiting** - Request throttling and security
- **Validation** - Request data validation

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Twilio Account (for OTP)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=marriage_app
   DB_USER=root
   DB_PASSWORD=your_password

   # JWT
   JWT_SECRET=your-super-secret-jwt-key

   # Twilio
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

4. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE marriage_app;
   ```

5. **Run the application**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 📊 Database Schema

### Users Table
- Basic user information (name, email, phone)
- Authentication data (password, verification status)
- Plan and subscription information
- Privacy and notification settings

### Profiles Table
- Personal details (height, weight, complexion)
- Location and family information
- Religious and cultural details
- Partner preferences
- Photos and media

### Proposals Table
- Proposal details and messages
- Status tracking (pending, accepted, rejected)
- Contact revelation logic
- Response tracking and analytics

### ProfileScores Table
- Overall profile score (0-100)
- Component scores (completion, activity, verification)
- Usage score based on engagement
- Score history and calculations

### QualificationsMarks Table
- Educational qualifications
- Professional experience
- Skills and achievements
- Verification status
- Search visibility controls

## 🔐 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Plan-based feature restrictions
- Session management

### Data Protection
- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### Rate Limiting
- Request throttling per IP
- Action-specific rate limits
- OTP request limits
- API abuse prevention

## 📈 Scoring System

### Profile Score Components
1. **Profile Completion (25%)** - Based on filled fields
2. **Activity Score (20%)** - User engagement metrics
3. **Verification Score (15%)** - Document verification status
4. **Response Score (20%)** - Proposal response behavior
5. **Quality Score (20%)** - Profile quality indicators

### Usage Score Factors
- Login frequency
- Profile views received
- Response rate to proposals
- Average response time
- Recent activity

## 🤖 Automated Tasks

### Scheduled Jobs
- **Hourly**: Cleanup expired OTPs
- **Every 6 hours**: Expire old proposals
- **Every 12 hours**: Expire old ads
- **Daily (2 AM)**: Update profile scores
- **Daily (10 AM)**: Send proposal reminders
- **Daily (4 AM)**: Update engagement scores
- **Daily (6 AM)**: Check expired plans
- **Weekly**: Generate analytics reports

## 📱 OTP System

### Features
- 6-digit numeric OTPs
- 10-minute expiration
- Rate limiting (5 OTPs per hour)
- Multiple delivery methods (SMS, WhatsApp)
- Retry mechanism with cooldown

### OTP Types
- Registration verification
- Login authentication
- Password reset
- Phone verification
- Profile updates

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/forgot-password` - Password reset

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/search` - Search users
- `POST /api/users/upload-photo` - Upload photos

### Proposals
- `POST /api/proposals/send` - Send proposal
- `GET /api/proposals/received` - Get received proposals
- `GET /api/proposals/sent` - Get sent proposals
- `PUT /api/proposals/:id/respond` - Respond to proposal

### Profiles
- `GET /api/profiles/:id` - Get profile details
- `PUT /api/profiles/:id` - Update profile
- `GET /api/profiles/featured` - Get featured profiles
- `POST /api/profiles/boost` - Boost profile

### Plans
- `GET /api/plans` - Get available plans
- `POST /api/plans/upgrade` - Upgrade plan
- `GET /api/plans/current` - Get current plan

### Ads
- `POST /api/ads/create` - Create advertisement
- `GET /api/ads` - Get active ads
- `PUT /api/ads/:id` - Update ad
- `DELETE /api/ads/:id` - Delete ad

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Coverage report
npm run test:coverage
```

## 📊 Monitoring & Logging

### Logging
- Structured logging with Winston
- Multiple log levels (error, warn, info, debug)
- File rotation and compression
- Request/response logging

### Health Checks
- Database connectivity
- Service status
- Memory usage
- Response times

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure production database
3. Set up SSL certificates
4. Configure load balancer
5. Set up monitoring and alerts

### Docker Deployment
```bash
# Build image
docker build -t marriage-app-backend .

# Run container
docker run -p 5000:5000 marriage-app-backend
```

## 📝 Environment Variables

### Required Variables
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

### Optional Variables
- `PORT` (default: 5000)
- `NODE_ENV` (default: development)
- `LOG_LEVEL` (default: info)
- `RATE_LIMIT_MAX_REQUESTS` (default: 100)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: support@marriageapp.com

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added advanced scoring system
- **v1.2.0** - Enhanced OTP and security features
- **v1.3.0** - Added automated tasks and analytics
