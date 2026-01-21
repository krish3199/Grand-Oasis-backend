const nodemailer = require("nodemailer");

// Send booking cancellation email
const sendCancellationEmail = async ({
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
  if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
    console.warn("EMAIL or EMAIL_PASS env vars not set, skipping cancellation email.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const formattedCheckIn = checkIn
    ? new Date(checkIn).toLocaleDateString("en-IN")
    : "";
  const formattedCheckOut = checkOut
    ? new Date(checkOut).toLocaleDateString("en-IN")
    : "";

  // --- NEW PREMIUM UI TEMPLATE START ---
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Cancelled</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; color: #333; line-height: 1.6; }
        .email-wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding-bottom: 20px; }
        
        /* Header Styling */
        .header { background-color: #1e293b; padding: 30px 20px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px; }
        .header p { margin: 5px 0 0; font-size: 14px; opacity: 0.8; text-transform: uppercase; letter-spacing: 2px; }
        
        .content { padding: 30px; }
        .greeting { font-size: 16px; margin-bottom: 20px; color: #475569; }
        
        /* Status Badge */
        .status-badge { 
            display: inline-block; 
            background-color: #fef2f2; 
            color: #991b1b; 
            padding: 6px 12px; 
            border-radius: 4px; 
            font-size: 13px; 
            font-weight: 600; 
            margin-bottom: 20px; 
            border: 1px solid #fecaca;
        }

        /* Image Styling - Grayscale for cancellation */
        .card-image { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 20px; background-color: #e2e8f0; filter: grayscale(100%); }
        
        .hotel-title { font-size: 22px; font-weight: bold; color: #0f172a; margin: 0 0 5px 0; }
        .hotel-city { font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 25px; display: block; }
        
        /* Table Styling */
        .details-grid { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        .details-grid td { padding: 12px 0; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .details-grid tr:last-child td { border-bottom: none; }
        .label { color: #64748b; font-size: 14px; font-weight: 500; }
        .value { color: #1e293b; font-size: 16px; font-weight: 600; text-align: right; }
        
        .booking-id { text-align: center; font-family: monospace; color: #94a3b8; font-size: 12px; margin-bottom: 30px; }
        
        .footer { text-align: center; font-size: 12px; color: #94a3b8; padding: 20px; border-top: 1px solid #e2e8f0; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <h1>GRAND OASIS</h1>
          <p>Booking Cancelled</p>
        </div>

        <div class="content">
          <p class="greeting">Hello <strong>${userName || "Guest"}</strong>,</p>
          <div class="status-badge">Cancellation Successful</div>
          <p style="margin-top:0; margin-bottom: 20px; color: #475569;">Your booking for the following hotel has been successfully cancelled.</p>

          ${
            hotelImage
              ? `<img src="${hotelImage}" alt="${hotelName}" class="card-image" />`
              : ""
          }

          <h2 class="hotel-title">${hotelName || ""}</h2>
          <span class="hotel-city">${city || ""}</span>

          ${
            checkIn || checkOut
              ? `<table class="details-grid">
                  ${formattedCheckIn ? `<tr><td class="label">Original Check-in</td><td class="value">${formattedCheckIn}</td></tr>` : ''}
                  ${formattedCheckOut ? `<tr><td class="label">Original Check-out</td><td class="value">${formattedCheckOut}</td></tr>` : ''}
                  ${days != null ? `<tr><td class="label">Duration</td><td class="value">${days} Night${days > 1 ? 's' : ''}</td></tr>` : ''}
                  ${totalPrice != null ? `<tr><td class="label">Total Amount</td><td class="value">₹${totalPrice?.toLocaleString?.("en-IN") || totalPrice}</td></tr>` : ''}
                 </table>`
              : ""
          }

          ${bookingId ? `<div class="booking-id">Booking ID: ${bookingId}</div>` : ""}

          <p style="text-align: center; color: #334155; font-size: 14px;">
            If this was a mistake, you can always make a new booking from our website.
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
     from: `"Grand Oasis" <${process.env.EMAIL}>`,
    to,
    subject: "Booking Cancelled | " + (hotelName || "Grand Oasis"),
    html,
  });
};

module.exports = sendCancellationEmail;