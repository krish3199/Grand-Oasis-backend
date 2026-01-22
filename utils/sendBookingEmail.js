const nodemailer = require("nodemailer");

// Send booking confirmation email after successful Razorpay payment
const sendBookingEmail = async ({
  to,
  userName,
  hotelName,
  city,
  checkIn,
  checkOut,
  days,
  totalPrice,
  bookingId,
  hotelImage,
}) => {
  // BREVO SMTP Configuration
  if (!process.env.BREVO_API_KEY) {
    console.warn("BREVO_API_KEY not set, skipping booking email.");
    return;
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@brevo.com";

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: senderEmail,
      pass: process.env.BREVO_API_KEY, // BREVO API key as password
    },
  });

  const formattedCheckIn = new Date(checkIn).toLocaleDateString("en-IN");
  const formattedCheckOut = new Date(checkOut).toLocaleDateString("en-IN");

  // --- NEW PREMIUM UI TEMPLATE START ---
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; color: #333; line-height: 1.6; }
        .email-wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding-bottom: 20px; }
        .header { background-color: #1e293b; padding: 30px 20px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px; }
        .header p { margin: 5px 0 0; font-size: 14px; opacity: 0.8; text-transform: uppercase; letter-spacing: 2px; }
        .content { padding: 30px; }
        .greeting { font-size: 16px; margin-bottom: 20px; color: #475569; }
        .card-image { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 20px; background-color: #e2e8f0; }
        .hotel-title { font-size: 22px; font-weight: bold; color: #0f172a; margin: 0 0 5px 0; }
        .hotel-city { font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 25px; display: block; }
        
        .details-grid { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        .details-grid td { padding: 12px 0; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .details-grid tr:last-child td { border-bottom: none; }
        .label { color: #64748b; font-size: 14px; font-weight: 500; }
        .value { color: #1e293b; font-size: 16px; font-weight: 600; text-align: right; }
        
        .price-box { background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 25px; text-align: center; }
        .price-label { display: block; font-size: 13px; color: #64748b; margin-bottom: 5px; }
        .price-amount { font-size: 28px; color: #0f172a; font-weight: 700; }
        
        .booking-id { text-align: center; font-family: monospace; color: #94a3b8; font-size: 12px; margin-bottom: 30px; }
        
        .footer { text-align: center; font-size: 12px; color: #94a3b8; padding: 20px; border-top: 1px solid #e2e8f0; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <h1>GRAND OASIS</h1>
          <p>Booking Confirmed</p>
        </div>

        <div class="content">
          <p class="greeting">Hello <strong>${userName || "Guest"}</strong>,</p>
          <p style="margin-top:0; margin-bottom: 20px; color: #475569;">Thank you for your reservation. We are delighted to confirm your upcoming stay.</p>

          ${
            hotelImage
              ? `<img src="${hotelImage}" alt="${hotelName}" class="card-image" />`
              : ""
          }

          <h2 class="hotel-title">${hotelName}</h2>
          <span class="hotel-city">${city}</span>

          <table class="details-grid">
            <tr>
              <td class="label">Check-in</td>
              <td class="value">${formattedCheckIn}</td>
            </tr>
            <tr>
              <td class="label">Check-out</td>
              <td class="value">${formattedCheckOut}</td>
            </tr>
            <tr>
              <td class="label">Duration</td>
              <td class="value">${days} Night${days > 1 ? 's' : ''}</td>
            </tr>
          </table>

          <div class="price-box">
            <span class="price-label">Total Amount Paid</span>
            <div class="price-amount">₹${totalPrice?.toLocaleString?.("en-IN") || totalPrice}</div>
          </div>

          ${
            bookingId
              ? `<div class="booking-id">Booking ID: ${bookingId}</div>`
              : ""
          }

          <p style="text-align: center; color: #334155; font-size: 14px;">
            We look forward to welcoming you.
          </p>
        </div>

        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Grand Oasis. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  // --- NEW PREMIUM UI TEMPLATE END ---

  await transporter.sendMail({
    from: `"Grand Oasis" <${senderEmail}>`,
    to,
    subject: "Booking Confirmed | " + hotelName,
    html,
  });
};

module.exports = sendBookingEmail;