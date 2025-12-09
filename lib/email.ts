import nodemailer from "nodemailer";

// Email configuration helper
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Send email helper
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@elitesurgicalcoders.com";

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send email");
  }
}

