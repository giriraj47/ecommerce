const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Ecommerce App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Ecommerce App";
  const text = `Hello ${name},\n\nWelcome to Ecommerce App! We're excited to have you on board.\n\nBest regards,\nThe Ecommerce App Team`;
  const html = `<p>Hello ${name},</p><p>Welcome to Ecommerce App! We're excited to have you on board.</p><p>Best regards,<br>The Ecommerce App Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function forgetPasswordEmail(userEmail, name, resetLink) {
  const subject = "Forget Password - Ecommerce App";
  const text = `Hello ${name},\n\nWe received a request to reset the password for your account. To reset your password, click the link below:\n\n${resetLink}\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nThe Ecommerce App Team`;
  const html = `<p>Hello ${name},</p>
<p>We received a request to reset the password for your account. Click the button below to proceed:</p>
<a href="${resetLink}" 
   style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
   Reset Password
</a>
<p>This link will expire in 30 minutes.</p>
<p>If you did not request this, please ignore this email.</p>`;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  forgetPasswordEmail,
};
