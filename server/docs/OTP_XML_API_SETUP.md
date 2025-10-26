# OTP XML API Integration Setup Guide

## Overview

The OTP service has been updated to use XML API for sending SMS OTPs instead of Twilio. This provides a more flexible and cost-effective solution for sending OTP messages.

## Features

- **XML API Integration**: Primary SMS provider using custom XML API
- **Automatic Fallback**: Falls back to mock service if XML API fails
- **Development Mode**: Mock service for testing without real SMS
- **Comprehensive Logging**: Detailed logs for debugging and monitoring
- **Error Handling**: Robust error handling with fallback mechanisms

## Architecture

```
┌─────────────────┐
│  Auth Controller │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  OTP Service     │
└────────┬────────┘
         │
         ├─────► XML API (Primary)
         │        └─► Real SMS Delivery
         │
         └─────► Mock Service (Fallback/Dev)
                  └─► Console Logging Only
```

## Environment Configuration

### Required Environment Variables

Add the following variables to your `server/.env` file:

```env
# SMS Provider Selection
SMS_PROVIDER=xml_api          # Options: 'xml_api' or 'mock'

# XML API Configuration
XML_API_ENDPOINT=https://your-xml-api-endpoint.com/send
XML_API_USERNAME=your_username
XML_API_PASSWORD=your_password
XML_API_SENDER_ID=MARAGE      # Your registered sender ID
XML_API_ROUTE=1               # Route number (usually 1 for transactional)

# App Configuration
APP_NAME=Marriage App
```

### Configuration Details

| Variable | Description | Example |
|----------|-------------|---------|
| `SMS_PROVIDER` | SMS provider to use | `xml_api` or `mock` |
| `XML_API_ENDPOINT` | Full URL of the XML API endpoint | `https://api.example.com/send` |
| `XML_API_USERNAME` | Your XML API username | `user123` |
| `XML_API_PASSWORD` | Your XML API password | `pass123` |
| `XML_API_SENDER_ID` | Registered sender ID | `MARAGE`, `TXTLCL`, etc. |
| `XML_API_ROUTE` | SMS route (1=Transactional, 2=Promotional) | `1` |
| `APP_NAME` | Application name shown in SMS | `Marriage App` |

## XML API Request Format

The service sends requests in the following XML format:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<hail version="1.0" encoding="utf-8">
  <message>
    <username>your_username</username>
    <password>your_password</password>
    <to>+919876543210</to>
    <sender-id>MARAGE</sender-id>
    <route>1</route>
    <text>Your Marriage App verification code is: 123456. Valid for 10 minutes.</text>
    <type>text</type>
    <datetime>2025-01-15 14:30:00</datetime>
  </message>
</hail>
```

## OTP Message Templates

The service automatically generates appropriate messages based on OTP type:

| OTP Type | Message Template |
|----------|-----------------|
| `registration` | "Welcome to {APP_NAME}! Your verification code is: {OTP}. Valid for 10 minutes." |
| `login` | "Your {APP_NAME} login code is: {OTP}. Valid for 10 minutes." |
| `password_reset` | "Your {APP_NAME} password reset code is: {OTP}. Valid for 10 minutes." |
| `phone_verification` | "Your {APP_NAME} phone verification code is: {OTP}. Valid for 10 minutes." |
| `email_verification` | "Your {APP_NAME} email verification code is: {OTP}. Valid for 10 minutes." |
| `profile_update` | "Your {APP_NAME} profile update verification code is: {OTP}. Valid for 10 minutes." |

## Usage in Code

The OTP service is already integrated into the auth controller. No changes needed to existing code:

```javascript
// Send OTP (Registration)
const result = await sendOTP(phoneNumber, 'registration');

// Send OTP (Login)
const result = await sendOTP(phoneNumber, 'login');

// Verify OTP
const verificationResult = await verifyOTP(phoneNumber, otpCode, otpType);

// Resend OTP
const resendResult = await resendOTP(phoneNumber, otpType);
```

## API Response Format

### Successful SMS Send

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otpId": 123,
  "retryAfter": 60,
  "mock": false,
  "fallback": false
}
```

### Fallback Mode (XML API Failed)

```json
{
  "success": true,
  "message": "OTP sent successfully (using fallback)",
  "otpId": 123,
  "retryAfter": 60,
  "fallback": true,
  "fallbackOTP": "123456"
}
```

### Mock Mode (Development)

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otpId": 123,
  "retryAfter": 60,
  "mock": true,
  "fallback": false
}
```

## Testing

### Development Testing (Mock Mode)

Set in `.env`:
```env
SMS_PROVIDER=mock
```

This will:
- Generate OTPs normally
- Log OTP to console instead of sending SMS
- Return OTP in API response for testing

### Production Testing (XML API)

Set in `.env`:
```env
SMS_PROVIDER=xml_api
XML_API_ENDPOINT=https://your-actual-endpoint.com/send
XML_API_USERNAME=your_real_username
XML_API_PASSWORD=your_real_password
```

Test with:
1. Send OTP to your own phone number
2. Check server logs for XML API request/response
3. Verify SMS delivery
4. Test OTP verification

## Logging

The service provides detailed console logs:

### XML API Send (Success)
```
📡 SENDING OTP VIA XML API 📡
📞 Phone: +919876543210
🔐 OTP Code: 123456
📝 Type: registration
📍 Endpoint: https://api.example.com/send
📱 Sender ID: MARAGE
📨 API Response Status: 200
✅ OTP SENT VIA XML API ✅
```

### Mock Mode
```
📱 MOCK OTP SERVICE 📱
📞 Phone: +919876543210
🔐 OTP Code: 123456
📝 Type: registration
✅ Status: Mock SMS sent
📱 MOCK OTP SERVICE 📱
```

### Fallback Mode
```
⚠️ XML API failed, falling back to mock service
📱 MOCK OTP SERVICE 📱
...
```

## Error Handling

The service has multiple layers of error handling:

1. **XML API Failure**: Automatically falls back to mock mode
2. **Network Timeout**: 10-second timeout with automatic fallback
3. **Invalid Response**: Logs error and uses fallback
4. **Database Errors**: Creates fallback OTP record
5. **Rate Limiting**: Prevents abuse (configurable)

## Security Features

- ✅ OTP expires in 10 minutes
- ✅ Rate limiting per phone number
- ✅ Maximum attempt tracking
- ✅ Secure password hashing in database
- ✅ IP address logging
- ✅ User agent tracking
- ✅ Device fingerprinting support

## Troubleshooting

### OTP Not Received

1. **Check XML API Configuration**
   - Verify `XML_API_ENDPOINT` is correct
   - Confirm credentials are valid
   - Check sender ID is registered

2. **Review Server Logs**
   ```bash
   # Check for XML API errors
   grep "XML API Error" logs/app.log

   # Check OTP generation
   grep "OTP Code:" logs/app.log
   ```

3. **Test XML API Separately**
   - Use Postman to test XML API directly
   - Verify response format matches expectations

### XML API Returns Error

Check the error message in logs:
```bash
❌ XML API Error: <error message>
```

Common issues:
- Invalid credentials
- Insufficient balance
- Sender ID not registered
- Invalid phone number format

### Fallback Always Triggered

If XML API constantly fails:
1. Verify endpoint URL is accessible
2. Check firewall/network restrictions
3. Confirm XML API service is active
4. Review API documentation for format changes

## Production Deployment Checklist

- [ ] Update `.env` with real XML API credentials
- [ ] Set `SMS_PROVIDER=xml_api`
- [ ] Test with real phone number
- [ ] Verify SMS delivery
- [ ] Check server logs for errors
- [ ] Test fallback mechanism
- [ ] Monitor rate limiting
- [ ] Setup log rotation
- [ ] Configure error alerts

## Support

For issues or questions:
1. Check server logs: `logs/app.log`
2. Review XML API provider documentation
3. Test with mock mode first
4. Contact XML API support for delivery issues

## Version History

- **v2.0** (2025-01-15): XML API integration with automatic fallback
- **v1.0** (2024-12-01): Initial Twilio integration (deprecated)
