# Payment Gateway Integration Setup

This document explains how to set up and use the plan-based payment system in the Marriage App.

## Overview

The payment system integrates Razorpay for handling plan subscriptions. Users can select from different plans (Silver, Gold, Diamond) and proposal packages (10 Proposals, 100 Proposals).

## Features

- **Plan-based Subscriptions**: Video profile packages (Silver, Gold, Diamond)
- **Proposal Packages**: Add-on services for sending proposals
- **Secure Payment Processing**: Razorpay integration with signature verification
- **User Plan Management**: Track active subscriptions and expiry dates
- **Payment History**: Complete payment records for users

## Setup Requirements

### 1. Environment Variables

Add these to your `.env` file in the server directory:

```env
RAZOR_PAY_KEY=your_razorpay_key_id
RAZOR_PAY_SECRET=your_razorpay_secret_key
```

### 2. Dependencies

The following packages are required:

```bash
# Server dependencies
npm install razorpay

# Client dependencies (already included)
# framer-motion, lucide-react, react-router-dom
```

## Database Schema

### Payment Table
- `id`: Primary key
- `userId`: User ID (for plan subscriptions)
- `registrationId`: Registration ID (for legacy registrations)
- `planId`: Plan ID
- `amount`: Amount in paise (smallest currency unit)
- `currency`: Currency code (INR/USD)
- `razorpayOrderId`: Razorpay order ID
- `razorpayPaymentId`: Razorpay payment ID
- `razorpaySignature`: Payment signature for verification
- `status`: Payment status (pending/completed/failed/cancelled)
- `metadata`: Additional payment information

### User Table Updates
- `plan_id`: Current plan ID
- `plan_info`: JSON object containing plan details
  - `id`: Plan ID
  - `expires_at`: Subscription expiry date
  - `subscribed_at`: Subscription start date
  - `payment_id`: Associated payment ID

## API Endpoints

### Plan Subscriptions

#### Create Payment Order
```
POST /api/v1/payments/subscribe
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": 1,
  "name": "John Doe",
  "phone": "+919876543210",
  "email": "john@example.com",
  "location": "Mumbai",
  "amount": 2199
}
```

#### Verify Payment
```
POST /api/v1/payments/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```

#### Get Current Subscription
```
GET /api/v1/payments/subscription/current
Authorization: Bearer <token>
```

#### Get Payment History
```
GET /api/v1/payments/history?page=1&limit=10
Authorization: Bearer <token>
```

### Plan Management

#### Get All Plans
```
GET /api/v1/plans
```

#### Get Plan by ID
```
GET /api/v1/plans/:planId
```

#### Subscribe to Plan (Legacy)
```
POST /api/v1/plans/subscribe
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": 1
}
```

## Frontend Integration

### 1. Plan Selection

Users can select plans from the `/pricings` page:
- **Video Profile Packages**: Silver (₹2199), Gold (₹5698), Diamond (₹8198)
- **Proposal Packages**: 10 Proposals (₹250), 100 Proposals (₹2000)

### 2. Checkout Process

1. User selects a plan
2. Redirected to `/checkout` with plan details
3. User fills personal information
4. Payment processed via Razorpay
5. Success/failure page shown
6. User redirected to dashboard or back to plans

### 3. Payment Flow

```javascript
// Example payment flow
const handlePayment = async () => {
  // 1. Create payment order
  const response = await fetch('/api/v1/payments/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      planId: planData.id,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      location: formData.location,
      amount: planData.price
    })
  });

  // 2. Initialize Razorpay
  const options = {
    key: response.data.payment.key,
    amount: response.data.payment.amount,
    currency: response.data.payment.currency,
    order_id: response.data.payment.orderId,
    handler: async function(response) {
      // 3. Verify payment
      await verifyPayment(response);
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
```

## Security Features

1. **Signature Verification**: All payments are verified using Razorpay signatures
2. **User Authentication**: All payment endpoints require valid JWT tokens
3. **Input Validation**: Comprehensive validation for all payment data
4. **Error Handling**: Proper error handling and logging

## Testing

### Test Cards (Razorpay Test Mode)

- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### Test Environment

1. Use Razorpay test keys
2. Test with small amounts
3. Verify payment flow end-to-end
4. Test error scenarios

## Production Deployment

1. **Switch to Live Keys**: Update environment variables with production Razorpay keys
2. **SSL Certificate**: Ensure HTTPS is enabled
3. **Webhook Setup**: Configure Razorpay webhooks for payment notifications
4. **Monitoring**: Set up payment monitoring and alerting
5. **Backup**: Regular database backups for payment records

## Troubleshooting

### Common Issues

1. **Payment Creation Fails**
   - Check Razorpay credentials
   - Verify database connection
   - Check user authentication

2. **Payment Verification Fails**
   - Verify signature calculation
   - Check Razorpay order status
   - Validate payment parameters

3. **User Plan Not Updated**
   - Check database constraints
   - Verify user model associations
   - Check transaction rollback

### Debug Mode

Enable debug logging in the server:

```javascript
// In server/index.js
process.env.DEBUG = 'payment:*';
```

## Support

For technical support:
- Check server logs for detailed error messages
- Verify Razorpay dashboard for payment status
- Review database constraints and relationships
- Test with Razorpay test environment first
