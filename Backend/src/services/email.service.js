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

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Ecommerce App" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
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

async function sendOrderConfirmationEmail(userEmail, userName, order) {
  const subject = `Order Confirmed! Receipt for Order #${order._id}`;

  const productRowsHtml = order.products
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
        <span style="font-weight: bold; color: #1e293b;">${item.name}</span><br>
        <span style="font-size: 0.85rem; color: #64748b;">Qty: ${item.quantity} @ $${item.price} each</span>
      </td>
      <td style="padding: 10px; text-align: right; font-weight: bold; color: #1e293b; border-bottom: 1px solid #e2e8f0;">
        $${item.subtotal.toFixed(2)}
      </td>
    </tr>
  `,
    )
    .join("");

  const text = `Hello ${userName},\n\nThank you for your order! Your order #${order._id} has been confirmed. Total Amount: $${order.totalAmount.toFixed(2)}.\n\nShipping Details:\n${order.shippingAddress.fullName}\n${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}\n\nBest regards,\nThe Ecommerce App Team`;

  const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #f8fafc; padding: 20px; color: #334155;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
        <div style="background: linear-gradient(135deg, #4f46e5, #6366f1); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 1.75rem; font-weight: 800;">Order Confirmed!</h1>
          <p style="margin: 5px 0 0 0; font-size: 0.95rem; opacity: 0.9;">Thank you for shopping with us, ${userName}</p>
        </div>
        <div style="padding: 30px;">
          <h3 style="margin-top: 0; color: #1e293b; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Order Details</h3>
          <p style="font-size: 0.9rem; color: #64748b;">Order ID: <span style="font-family: monospace; font-weight: bold; color: #1e293b;">#${order._id}</span></p>
          <p style="font-size: 0.9rem; color: #64748b;">Payment Method: <span style="font-weight: bold; color: #1e293b; text-transform: uppercase;">${order.paymentMethod}</span></p>
          <p style="font-size: 0.9rem; color: #64748b;">Payment Status: <span style="font-weight: bold; color: #10b981; text-transform: uppercase;">${order.paymentStatus}</span></p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f8fafc;">
                <th style="padding: 10px; text-align: left; font-size: 0.85rem; text-transform: uppercase; color: #64748b; border-bottom: 2px solid #e2e8f0;">Item</th>
                <th style="padding: 10px; text-align: right; font-size: 0.85rem; text-transform: uppercase; color: #64748b; border-bottom: 2px solid #e2e8f0;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${productRowsHtml}
              <tr>
                <td style="padding: 20px 10px 10px 10px; text-align: right; font-weight: bold; color: #64748b;">Total Amount:</td>
                <td style="padding: 20px 10px 10px 10px; text-align: right; font-size: 1.25rem; font-weight: 800; color: #4f46e5;">
                  $${order.totalAmount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; border: 1px solid #f1f5f9; margin-top: 30px;">
            <h4 style="margin: 0 0 10px 0; color: #1e293b;">Shipping Address</h4>
            <p style="margin: 0; font-size: 0.9rem; line-height: 1.5; color: #475569;">
              <strong>${order.shippingAddress.fullName}</strong><br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}<br>
              Phone: ${order.shippingAddress.phone}
            </p>
          </div>
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #94a3b8;">
          <p style="margin: 0;">If you have any questions about this order, please contact our support team.</p>
          <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} Ecommerce App. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendOrderStatusUpdateEmail(userEmail, userName, order) {
  const subject = `Order Status Updated: #${order._id} is ${order.orderStatus.toUpperCase()}`;

  const text = `Hello ${userName},\n\nThe status of your order #${order._id} has been updated to: ${order.orderStatus.toUpperCase()}.\n\nBest regards,\nThe Ecommerce App Team`;

  const statusColors = {
    pending: "#eab308",
    confirmed: "#3b82f6",
    shipped: "#6366f1",
    delivered: "#10b981",
    cancelled: "#ef4444",
    paid: "#10b981",
  };

  const statusColor = statusColors[order.orderStatus] || "#4f46e5";

  const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #f8fafc; padding: 20px; color: #334155;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
        <div style="background: linear-gradient(135deg, #4f46e5, #6366f1); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 1.75rem; font-weight: 800;">Order Status Update</h1>
          <p style="margin: 5px 0 0 0; font-size: 0.95rem; opacity: 0.9;">Great news, ${userName}!</p>
        </div>
        <div style="padding: 30px; text-align: center;">
          <p style="font-size: 1.1rem; color: #475569; margin-top: 0;">
            The status of your order <span style="font-family: monospace; font-weight: bold; color: #1e293b;">#${order._id}</span> has been updated to:
          </p>
          <div style="display: inline-block; padding: 10px 30px; font-size: 1.25rem; font-weight: 800; color: white; background-color: ${statusColor}; border-radius: 50px; text-transform: uppercase; margin: 15px 0; letter-spacing: 0.05em; box-shadow: 0 4px 10px -2px ${statusColor}4D;">
            ${order.orderStatus}
          </div>
          
          <p style="font-size: 0.95rem; color: #64748b; line-height: 1.6; margin-bottom: 30px;">
            ${order.orderStatus === "confirmed" ? "Your order has been reviewed and is now being prepared for shipment!" : ""}
            ${order.orderStatus === "paid" ? "Your payment was successfully processed and the order is confirmed!" : ""}
            ${order.orderStatus === "shipped" ? "Excellent! Your package has left our fulfillment center and is on its way to your shipping address." : ""}
            ${order.orderStatus === "delivered" ? "Hooray! The courier partner has successfully delivered the package to your doorstep. We hope you love your purchase!" : ""}
            ${order.orderStatus === "cancelled" ? "We regret to inform you that this order was cancelled. If you didn't initiate this, please contact support immediately." : ""}
          </p>

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; border: 1px solid #f1f5f9; text-align: left;">
            <h4 style="margin: 0 0 10px 0; color: #1e293b;">Delivery Snapshot</h4>
            <p style="margin: 0; font-size: 0.9rem; line-height: 1.5; color: #475569;">
              <strong>Recipient:</strong> ${order.shippingAddress.fullName}<br>
              <strong>Destination:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}<br>
              <strong>Items Count:</strong> ${order.products.reduce((acc, curr) => acc + curr.quantity, 0)} units
            </p>
          </div>
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #94a3b8;">
          <p style="margin: 0;">If you have any questions about this status change, please reply to this email.</p>
          <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} Ecommerce App. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  forgetPasswordEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
};
