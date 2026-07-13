import nodemailer from "nodemailer";

const createTransporter = () => nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const htmlWrap = (content) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#FF5A5F;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="color:white;margin:0;">🏠 StayEase</h1>
  </div>
  <div style="background:#f9f9f9;padding:30px;border-radius:0 0 8px 8px;">${content}</div>
</div>`;

export const sendPasswordResetEmail = async (email, name, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await createTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset Your Password — StayEase",
    html: htmlWrap(`<h2>Hi ${name},</h2>
      <p>Click below to reset your password. Link expires in <strong>10 minutes</strong>.</p>
      <div style="text-align:center;margin:30px 0;">
        <a href="${url}" style="background:#FF5A5F;color:white;padding:14px 30px;text-decoration:none;border-radius:8px;font-weight:bold;">Reset Password</a>
      </div>
      <p style="color:#999;font-size:12px;">Or copy: <a href="${url}">${url}</a></p>`),
  });
};

export const sendVerificationEmail = async (email, name, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
  await createTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify Your Email — StayEase",
    html: htmlWrap(`<h2>Welcome, ${name}! 🎉</h2>
      <p>Please verify your email to get started.</p>
      <div style="text-align:center;margin:30px 0;">
        <a href="${url}" style="background:#FF5A5F;color:white;padding:14px 30px;text-decoration:none;border-radius:8px;">Verify Email</a>
      </div>`),
  });
};

export const sendBookingConfirmationEmail = async (email, name, booking) => {
  await createTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Booking Confirmed! — StayEase",
    html: htmlWrap(`<h2>Hi ${name}! Your booking is confirmed ✅</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Check-in</strong></td>
            <td style="padding:8px;border-bottom:1px solid #eee;">${new Date(booking.checkIn).toDateString()}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Check-out</strong></td>
            <td style="padding:8px;border-bottom:1px solid #eee;">${new Date(booking.checkOut).toDateString()}</td></tr>
        <tr><td style="padding:8px;"><strong>Total</strong></td>
            <td style="padding:8px;">₹${booking.pricing?.totalPrice?.toLocaleString()}</td></tr>
      </table>`),
  });
};
