export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to Station360!</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #2196F3, #0b7dda); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Welcome to Station360!</h1>
  </div>
  <div style="background-color: #f5f5f5; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hi <strong>{name}</strong>,</p>
    <p>We're thrilled to have you on board! 🎉</p>
    <p>Get ready to explore everything that Station360 has to offer.</p>
    <p>If you have any questions, feel free to reach out to us anytime.</p>
    <p>Cheers,<br>The Station360 Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; font-size: 0.9em; color: #999;">
    <p>This is an automated message. Please do not reply directly to this email.</p>
  </div>
</body>
</html>
`;

export const TWO_FACTOR_SETUP_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Set Up Two-Factor Authentication</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #2196F3, #0b7dda); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Set Up Two-Factor Authentication</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello {name},</p>
    <p>You've requested to enable Two-Factor Authentication (2FA) for your Station360 account.</p>
    <p>To complete the setup, enter this secret key in your authenticator app:</p>
    <div style="text-align: center; margin: 20px 0; padding: 10px; background-color: #f0f0f0; border-radius: 5px;">
      <code style="font-family: monospace; font-size: 14px;">{secret}</code>
    </div>
    <p>After entering the secret key, enter the 6-digit code from your authenticator app to complete the setup.</p>
    <p>For security reasons, this secret key will only be valid for a limited time.</p>
    <p>If you didn't request this setup, please contact our support team immediately.</p>
    <p>Best regards,<br>The Station360 Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const EMPLOYEE_WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to Station360!</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #2196F3, #0b7dda); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Welcome to Station360!</h1>
  </div>
  <div style="background-color: #f5f5f5; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hi <strong>{name}</strong>,</p>
    <p>Welcome to the Station360 team! We're excited to have you join us. 🎉</p>
    <p>Your role as <strong>{position}</strong> is crucial to our mission, and we’re confident you'll make a great impact.</p>
    <p>Here are a few things to help you get started:</p>
    <ul>
      <li>Access your employee portal: <a href="{portalLink}">{portalLink}</a></li>
      <li>Connect with your team lead: <strong>{teamLeadName}</strong></li>
      <li>Read our onboarding guide: <a href="{onboardingGuideLink}">Onboarding Guide</a></li>
    </ul>
    <p>If you have any questions or need assistance, don't hesitate to reach out.</p>
    <p>Looking forward to achieving great things together!</p>
    <p>Best regards,<br>The Station360 HR Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; font-size: 0.9em; color: #999;">
    <p>This is an automated message. Please do not reply directly to this email.</p>
  </div>
</body>
</html>
`;


export const BOOKING_CANCELLATION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Cancellation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #f44336, #d32f2f); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Booking Cancellation</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Dear {customerName},</p>
    <p>We regret to inform you that your booking has been cancelled by our administration team.</p>
    <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #eee;">
      <p><strong>Booking Details:</strong></p>
      <p>Date: {bookingDate}</p>
      <p>Time: {bookingTime}</p>
      <p>Service: {serviceName}</p>
      <p>Vehicle: {vehicleDetails}</p>
    </div>
    <p><strong>Reason for Cancellation:</strong></p>
    <p style="background-color: #fff3f3; padding: 10px; border-radius: 5px; border-left: 4px solid #f44336;">
      {cancellationReason}
    </p>
    <p>We sincerely apologize for any inconvenience this may have caused. Please feel free to book another appointment at your convenience.</p>
    <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
    <p>Best regards,<br>The Station360 Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const BOOKING_CONFIRMATION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Booking Confirmation</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Dear {customerName},</p>
    <p>Thank you for booking with Station360! Your appointment has been confirmed.</p>
    
    <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #eee;">
      <p><strong>Booking Details:</strong></p>
      <p>Service: {serviceName}</p>
      <p>Date: {bookingDate}</p>
      <p>Time: {bookingTime} - {endTime}</p>
      <p>Vehicle: {vehicleDetails}</p>
    </div>

    <h3 style="color: #2196F3; margin-top: 20px;">Important Instructions:</h3>
    <ul style="list-style-type: none; padding: 0;">
      <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
        <span style="position: absolute; left: 0; color: #4CAF50;">✓</span>
        Please arrive 10 minutes before your scheduled time
      </li>
      <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
        <span style="position: absolute; left: 0; color: #4CAF50;">✓</span>
        Bring your vehicle's registration documents
      </li>
      <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
        <span style="position: absolute; left: 0; color: #4CAF50;">✓</span>
        Remove all personal belongings from your vehicle
      </li>
      <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
        <span style="position: absolute; left: 0; color: #4CAF50;">✓</span>
        Our team will contact you if there are any changes to your appointment
      </li>
    </ul>

    <p style="margin-top: 20px;">If you need to make any changes to your booking, please contact us at least 24 hours before your appointment.</p>
    <p>We look forward to serving you!</p>
    <p>Best regards,<br>The Station360 Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;
