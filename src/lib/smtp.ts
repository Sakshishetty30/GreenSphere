import nodemailer from 'nodemailer';

// Use environment variables for sensitive details
const smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
};

export const transporter = nodemailer.createTransport(smtpConfig);

export const sendOTP = async (to: string, otp: string, purpose: string) => {
  let subject = '';
  let html = '';

  if (purpose === 'registration') {
    subject = 'Verify your GreenSphere Account';
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #2e7d32;">Welcome to GreenSphere!</h2>
        <p>Thank you for registering. Please use the following OTP to verify your email address:</p>
        <div style="background-color: #f1f8e9; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; border-radius: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,<br/>The GreenSphere Team</p>
      </div>
    `;
  } else if (purpose === 'reset_password') {
    subject = 'Reset your GreenSphere Password';
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #2e7d32;">Password Reset Request</h2>
        <p>We received a request to reset your password. Please use the following OTP to reset it:</p>
        <div style="background-color: #f1f8e9; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; border-radius: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <p>Best regards,<br/>The GreenSphere Team</p>
      </div>
    `;
  }

  const mailOptions = {
    from: `"GreenSphere" <${process.env.SMTP_USER || 'noreply@greensphere.com'}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendOrderConfirmation = async (to: string, orderId: string, amount: number, items: any[]) => {
  const subject = `Order Confirmation - ${orderId}`;
  
  const itemsHtml = items.map(i => `<li>${i.quantity}x ${i.product.name} (₹${i.product.price})</li>`).join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #2e7d32;">Thank you for your order!</h2>
      <p>Your order <strong>${orderId}</strong> has been successfully placed and is now processing.</p>
      
      <div style="background-color: #f1f8e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top:0;">Order Summary</h3>
        <ul>
          ${itemsHtml}
        </ul>
        <hr style="border: 0; border-top: 1px solid #ccc;" />
        <p style="font-size: 18px; font-weight: bold; text-align: right;">Total Paid: ₹${amount.toLocaleString('en-IN')}</p>
      </div>
      
      <p>You can track your order status in your Dashboard.</p>
      <p>Best regards,<br/>The GreenSphere Team</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_USER || '"GreenSphere" <noreply@greensphere.com>',
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendEmail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: `"GreenSphere" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
