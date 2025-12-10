import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { escapeHtml, escapeHtmlWithBreaks } from "@/lib/utils";

const applicationSchema = z.object({
  careerPostId: z.string().optional(),
  positionTitle: z.string().min(1, "Position title is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  resume: z.string().min(1, "Resume is required"),
  coverLetter: z.string().optional(),
  experience: z.string().optional(),
  certifications: z.string().optional(),
});

// POST - Submit job application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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
    
    // Return more detailed error in development
    const errorMessage = process.env.NODE_ENV === "development" && error instanceof Error
      ? error.message || "An error occurred submitting your application"
      : "An error occurred submitting your application";
    
    return NextResponse.json(
      { 
        message: errorMessage,
        error: process.env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

