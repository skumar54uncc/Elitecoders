import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { escapeHtml, escapeHtmlWithBreaks } from "@/lib/utils";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isTrustedResumePublicUrl } from "@/lib/validate-resume-url";

const applicationSchema = z.object({
  careerPostId: z.string().max(40).optional(),
  positionTitle: z.string().min(1, "Position title is required").max(300),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address").max(254),
  phone: z.string().min(1, "Phone number is required").max(40),
  resume: z
    .string()
    .min(1, "Resume is required")
    .max(2048)
    .refine(isTrustedResumePublicUrl, {
      message: "Invalid resume URL",
    }),
  coverLetter: z.string().max(20_000).optional(),
  experience: z.string().max(5000).optional(),
  certifications: z.string().max(2000).optional(),
});

// POST - Submit job application
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = checkRateLimit(`apply:${ip}`, 8, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { message: "Too many applications from this network. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfter) },
      }
    );
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const validationResult = applicationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Convert empty string to null for optional fields
    const careerPostId = data.careerPostId && data.careerPostId.trim() !== "" ? data.careerPostId : null;

    // Create application in database
    const application = await prisma.jobApplication.create({
      data: {
        careerPostId: careerPostId,
        positionTitle: data.positionTitle,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        resume: data.resume,
        coverLetter: data.coverLetter && data.coverLetter.trim() !== "" ? data.coverLetter : null,
        experience: data.experience && data.experience.trim() !== "" ? data.experience : null,
        certifications: data.certifications && data.certifications.trim() !== "" ? data.certifications : null,
        status: "pending",
      },
    });

    // Send email notification to admin
    const internalNotificationEmail = process.env.INTERNAL_NOTIFICATION_EMAIL || "notifications@elitesurgicalcoders.com";
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.elitesurgicalcoders.com";

    // Escape all user input to prevent XSS in emails
    const emailHtml = `
      <h2>New Job Application Received</h2>
      <p><strong>Position:</strong> ${escapeHtml(data.positionTitle)}</p>
      <p><strong>Applicant:</strong> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
      ${data.experience ? `<p><strong>Experience:</strong> ${escapeHtml(data.experience)}</p>` : ""}
      ${data.certifications ? `<p><strong>Certifications:</strong> ${escapeHtml(data.certifications)}</p>` : ""}
      ${data.coverLetter ? `<p><strong>Cover Letter:</strong><br>${escapeHtmlWithBreaks(data.coverLetter)}</p>` : ""}
      <p><strong>Resume:</strong> <a href="${escapeHtml(siteUrl + data.resume)}">View Resume</a></p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      <hr>
      <p><a href="${escapeHtml(siteUrl + "/admin?tab=applications")}">Review Application in Admin Portal</a></p>
    `;

    try {
      await sendEmail({
        to: internalNotificationEmail,
        subject: `New Job Application: ${escapeHtml(data.positionTitle)} - ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error("Error sending notification email:", emailError);
      // Don't fail the application submission if email fails
    }

    // Send confirmation email to applicant
    const confirmationHtml = `
      <p>Dear ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)},</p>
      <p>Thank you for your interest in the <strong>${escapeHtml(data.positionTitle)}</strong> position at Elite Surgical Coders.</p>
      <p>We have successfully received your application and resume. Our team will review your application and get back to you soon.</p>
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>Elite Surgical Coders Team</p>
    `;

    try {
      await sendEmail({
        to: data.email,
        subject: `Application Received: ${escapeHtml(data.positionTitle)}`,
        html: confirmationHtml,
      });
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Don't fail the application submission if email fails
    }

    return NextResponse.json(
      { 
        message: "Application submitted successfully",
        applicationId: application.id
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { message: "An error occurred submitting your application" },
      { status: 500 }
    );
  }
}

