import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { z } from "zod";

// Validation schema
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  organization: z.string().min(1, "Organization is required"),
  role: z.string().min(1, "Role is required"),
  servicesNeeded: z.array(z.string()).min(1, "At least one service must be selected"),
  message: z.string().min(1, "Message is required"),
  phiAcknowledgment: z.boolean().refine((val) => val === true, {
    message: "PHI acknowledgment is required",
  }),
});

// Email configuration helper
function createTransporter() {
  // Check if SendGrid is configured
  if (process.env.SENDGRID_API_KEY) {
    // For SendGrid, you would use @sendgrid/mail
    // For now, we'll use nodemailer with SMTP
    // You can replace this with SendGrid SDK later
  }

  // Use SMTP configuration
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
async function sendEmail({
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Store in database
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        organization: data.organization,
        role: data.role,
        servicesNeeded: JSON.stringify(data.servicesNeeded),
        message: data.message,
      },
    });

    // Prepare email content
    const internalNotificationEmail = process.env.INTERNAL_NOTIFICATION_EMAIL || "notifications@elitesurgicalcoders.com";

    const internalEmailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Organization:</strong> ${data.organization}</p>
      <p><strong>Role:</strong> ${data.role}</p>
      <p><strong>Services Needed:</strong></p>
      <ul>
        ${data.servicesNeeded.map((service) => `<li>${service}</li>`).join("")}
      </ul>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, "<br>")}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    `;

    const autoReplyHtml = `
      <p>Dear ${data.name},</p>
      <p>Thank you for reaching out to Elite Surgical Coders and Medical Billing LLC. We've received your message and will get back to you within 1 business day.</p>
      <p><strong>Important:</strong> Please do not share patient-identifying information (PHI) by email. Once we connect, we'll provide secure methods for exchanging PHI as needed.</p>
      <p>Best regards,<br>Elite Surgical Coders Team</p>
    `;

    // Send emails (in parallel, but don't fail if email fails)
    const emailPromises = [
      sendEmail({
        to: internalNotificationEmail,
        subject: `New Contact Form: ${data.name} from ${data.organization}`,
        html: internalEmailHtml,
      }).catch((error) => {
        console.error("Failed to send internal notification:", error);
      }),
      sendEmail({
        to: data.email,
        subject: "We've received your message – Elite Surgical Coders",
        html: autoReplyHtml,
      }).catch((error) => {
        console.error("Failed to send auto-reply:", error);
      }),
    ];

    await Promise.allSettled(emailPromises);

    return NextResponse.json(
      { message: "Form submitted successfully", id: lead.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { message: "An error occurred processing your request" },
      { status: 500 }
    );
  }
}

