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

export const LOW_STOCK_ORDER_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Low Stock Order Request</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Low Stock Order Request</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <p>Dear Supplier,</p>
        <p>This is an automated message to inform you that the following items are running low in stock and need to be replenished:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
                <tr>
                    <th style="background-color: #f8f9fa; padding: 10px; border: 1px solid #ddd;">Item Name</th>
                    <th style="background-color: #f8f9fa; padding: 10px; border: 1px solid #ddd;">Brand</th>
                    <th style="background-color: #f8f9fa; padding: 10px; border: 1px solid #ddd;">Quantity Needed</th>
                    <th style="background-color: #f8f9fa; padding: 10px; border: 1px solid #ddd;">Unit Type</th>
                </tr>
            </thead>
            <tbody>
                {itemsList}
            </tbody>
        </table>

        <p>Please process this order as soon as possible to ensure continuous supply.</p>
        <p>Best regards,<br>Station360 Inventory Management System</p>
    </div>
    <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
        <p>This is an automated message, please do not reply to this email.</p>
    </div>
</body>
</html>
`;

