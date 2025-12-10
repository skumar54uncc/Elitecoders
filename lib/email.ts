import nodemailer from "nodemailer";

// Email configuration helper
function createTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Validate required credentials
  if (!user || !pass) {
    throw new Error("SMTP credentials are not configured. Please set SMTP_USER and SMTP_PASS environment variables.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
}

// Send email helper
export async function sendEmail({
  to,
  cc,
  subject,
  html,
}: {
  to: string;
  cc?: string | string[];
  subject: string;
  html: string;
}) {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@elitesurgicalcoders.com";

  try {
    const mailOptions: {
      from: string;
      to: string;
      cc?: string | string[];
      subject: string;
      html: string;
    } = {
      from,
      to,
      subject,
      html,
    };

    if (cc) {
      mailOptions.cc = cc;
    }

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", {
      to,
      cc,
      messageId: result.messageId,
    });
    return result;
  } catch (error) {
    console.error("Email sending error:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        code: (error as any).code,
        command: (error as any).command,
      });
    }
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

