const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    // 🔥 SENDER NAME
    from: '"Grand Oasis" <grandoasis99@gmail.com>',

    to: email,

    // 🔥 Subject
    subject: 'Reset your password | GRAND OASIS',

    // 🔥 PREMIUM UI WITH YOUR EXACT LOGO
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px;">
        
        <!-- Main Card -->
        <div style="max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.06); overflow: hidden;">
          
          <!-- Logo Section (Centered) -->
          <div style="text-align: center; padding-top: 40px; padding-bottom: 25px;">
            <!-- Aapka logo yahan hai -->
          </div>

          <!-- Content Section -->
          <div style="padding: 10px 40px 50px 40px; text-align: center;">
            
            <h2 style="margin: 0 0 15px 0; color: #333333; font-size: 24px; font-weight: 600;">
              Verify your account
            </h2>
            
            <p style="margin: 0 0 30px 0; color: #666666; font-size: 15px; line-height: 1.6;">
              We received a request to reset your password. Enter the One-Time Password (OTP) below to continue.
            </p>

            <!-- OTP Box -->
            <div style="background-color: #eef2f6; border-radius: 8px; padding: 20px; margin-bottom: 30px; display: inline-block; width: 100%; box-sizing: border-box;">
              <span style="display: block; font-size: 32px; font-weight: 700; color: #004d40; letter-spacing: 6px; font-family: 'Courier New', Courier, monospace;">
                ${otp}
              </span>
            </div>

            <p style="margin: 0; color: #888888; font-size: 13px;">
              This code expires in <strong>5 minutes</strong>.<br><br>
              If you didn't request this, please ignore this email.
            </p>

          </div>

          <!-- Footer -->
          <div style="background-color: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="margin: 0; color: #999999; font-size: 12px;">
              &copy; ${new Date().getFullYear()} Grand Oasis. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    `
  });
};

module.exports = sendEmail;