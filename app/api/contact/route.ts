import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { z } from "zod";
import { escapeHtml, escapeHtmlWithBreaks } from "@/lib/utils";

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

// Professional email template helper
function getEmailTemplate(content: string, title?: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.elitesurgicalcoders.com";
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || "Elite Surgical Coders"}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td style="padding: 20px 0;">
        <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #211f50; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #cfb37a; margin: 0; font-size: 24px;">Elite Surgical Coders</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">Medical Billing LLC</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; margin: 0; font-size: 12px;">
                Elite Surgical Coders and Medical Billing LLC<br>
                80-02 Kew Gardens Road, Kew Gardens, NY 11415<br>
                ${process.env.NEXT_PUBLIC_PHONE ? `Phone: ${process.env.NEXT_PUBLIC_PHONE}<br>` : ""}
                ${process.env.NEXT_PUBLIC_EMAIL ? `Email: ${process.env.NEXT_PUBLIC_EMAIL}` : ""}
              </p>
              <p style="color: #999999; margin: 10px 0 0 0; font-size: 11px;">
                This is an automated message. Please do not reply directly to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
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

    // Store in database (with error handling)
    let lead;
    try {
      lead = await prisma.lead.create({
        data: {
          name: data.name,
          email: data.email,
          organization: data.organization,
          role: data.role,
          servicesNeeded: JSON.stringify(data.servicesNeeded),
          message: data.message,
        },
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Continue with email sending even if database fails
      // This ensures form submissions aren't lost
    }

    // Prepare email content
    const internalNotificationEmail = process.env.INTERNAL_NOTIFICATION_EMAIL || "notifications@elitesurgicalcoders.com";
    const responderEmail = process.env.SMTP_FROM || process.env.SMTP_USER || internalNotificationEmail;

    // Internal notification email content
    const internalEmailContent = `
      <h2 style="color: #211f50; margin-top: 0;">New Contact Form Submission</h2>
      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 10px 0;"><strong style="color: #211f50;">Name:</strong> <span style="color: #333;">${escapeHtml(data.name)}</span></p>
        <p style="margin: 10px 0;"><strong style="color: #211f50;">Email:</strong> <a href="mailto:${escapeHtml(data.email)}" style="color: #cfb37a; text-decoration: none;">${escapeHtml(data.email)}</a></p>
        <p style="margin: 10px 0;"><strong style="color: #211f50;">Organization:</strong> <span style="color: #333;">${escapeHtml(data.organization)}</span></p>
        <p style="margin: 10px 0;"><strong style="color: #211f50;">Role:</strong> <span style="color: #333;">${escapeHtml(data.role)}</span></p>
        <p style="margin: 10px 0;"><strong style="color: #211f50;">Services Needed:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px; color: #333;">
          ${data.servicesNeeded.map((service) => `<li style="margin: 5px 0;">${escapeHtml(service)}</li>`).join("")}
        </ul>
      </div>
      <div style="margin: 20px 0;">
        <p style="margin: 10px 0;"><strong style="color: #211f50;">Message:</strong></p>
        <div style="background-color: #ffffff; padding: 15px; border-left: 3px solid #cfb37a; margin: 10px 0;">
          <p style="margin: 0; color: #333; line-height: 1.6;">${escapeHtmlWithBreaks(data.message)}</p>
        </div>
      </div>
      <p style="color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <strong>Submitted:</strong> ${new Date().toLocaleString("en-US", { 
          weekday: "long", 
          year: "numeric", 
          month: "long", 
          day: "numeric", 
          hour: "2-digit", 
          minute: "2-digit" 
        })}
      </p>
      <p style="color: #666; font-size: 12px; margin-top: 10px;">
        <strong>Reply to:</strong> <a href="mailto:${escapeHtml(data.email)}" style="color: #cfb37a;">${escapeHtml(data.email)}</a>
      </p>
    `;

    // Confirmation email content (sent to the person who filled the form)
    const confirmationEmailContent = `
      <p style="font-size: 16px; color: #333; line-height: 1.6;">Dear ${escapeHtml(data.name)},</p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Thank you for reaching out to <strong style="color: #211f50;">Elite Surgical Coders and Medical Billing LLC</strong>. 
        We've successfully received your message and our team will review it shortly.
      </p>
      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 4px; margin: 20px 0; border-left: 3px solid #cfb37a;">
        <p style="margin: 0; font-size: 14px; color: #333; line-height: 1.6;">
          <strong style="color: #211f50;">What happens next?</strong><br>
          Our team will get back to you within <strong>1 business day</strong> to discuss your needs and answer any questions you may have.
        </p>
      </div>
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 3px solid #ffc107;">
        <p style="margin: 0; font-size: 14px; color: #856404; line-height: 1.6;">
          <strong>Important:</strong> Please do not share patient-identifying information (PHI) by email. 
          Once we connect, we'll provide secure methods for exchanging PHI as needed.
        </p>
      </div>
      <p style="font-size: 16px; color: #333; line-height: 1.6; margin-top: 30px;">
        If you have any urgent questions, please feel free to contact us directly.
      </p>
      <p style="font-size: 16px; color: #333; line-height: 1.6; margin-top: 20px;">
        Best regards,<br>
        <strong style="color: #211f50;">Elite Surgical Coders Team</strong>
      </p>
    `;

    // Send confirmation email to the person who filled the form (with CC to responder)
    let emailErrors: string[] = [];
    
    try {
      await sendEmail({
        to: data.email,
        cc: responderEmail, // CC the responder so they know which email to reply from
        subject: "We've received your message – Elite Surgical Coders",
        html: getEmailTemplate(confirmationEmailContent, "Message Received"),
      });
      console.log("Confirmation email sent successfully to:", data.email);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      emailErrors.push(`Failed to send confirmation email: ${errorMessage}`);
      console.error("Failed to send confirmation email:", error);
    }

    // Send internal notification email
    try {
      await sendEmail({
        to: internalNotificationEmail,
        subject: `New Contact Form: ${escapeHtml(data.name)} from ${escapeHtml(data.organization)}`,
        html: getEmailTemplate(internalEmailContent, "New Contact Form Submission"),
      });
      console.log("Internal notification email sent successfully to:", internalNotificationEmail);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      emailErrors.push(`Failed to send internal notification: ${errorMessage}`);
      console.error("Failed to send internal notification:", error);
    }

    // If there were email errors, log them but don't fail the request
    if (emailErrors.length > 0) {
      console.error("Email sending errors:", emailErrors);
    }

    return NextResponse.json(
      { 
        message: "Form submitted successfully", 
        id: lead?.id || "email-only",
        emailSent: emailErrors.length === 0,
        emailErrors: emailErrors.length > 0 ? emailErrors : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred processing your request";
    
    // Check if it's an email configuration error
    if (errorMessage.includes("SMTP credentials")) {
      return NextResponse.json(
        { 
          message: "Email configuration error. Please check server logs.",
          error: process.env.NODE_ENV === "development" ? errorMessage : undefined
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        message: "An error occurred processing your request",
        error: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

