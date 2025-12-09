import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { escapeHtml, escapeHtmlWithBreaks } from "@/lib/utils";

const updateApplicationSchema = z.object({
  status: z.enum(["pending", "accepted", "rejected"]),
  notes: z.string().optional(),
});

// GET - Get single application
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const application = await prisma.jobApplication.findUnique({
      where: { id: params.id },
      include: {
        careerPost: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ application }, { status: 200 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { message: "An error occurred fetching the application" },
      { status: 500 }
    );
  }
}

// PUT - Update application status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const validationResult = updateApplicationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if application exists
    const existingApplication = await prisma.jobApplication.findUnique({
      where: { id: params.id },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    // Update application
    const application = await prisma.jobApplication.update({
      where: { id: params.id },
      data: {
        status: data.status,
        notes: data.notes || null,
        reviewedBy: user.id,
        reviewedAt: new Date(),
      },
    });

    // Send email notification to applicant
    // Escape all user input and database content to prevent XSS
    const escapedPositionTitle = escapeHtml(existingApplication.positionTitle);
    const statusMessages = {
      accepted: {
        subject: `Application Update: ${escapedPositionTitle}`,
        message: `Congratulations! We are pleased to inform you that your application for the ${escapedPositionTitle} position has been accepted. Our team will contact you shortly to discuss next steps.`,
      },
      rejected: {
        subject: `Application Update: ${escapedPositionTitle}`,
        message: `Thank you for your interest in the ${escapedPositionTitle} position at Elite Surgical Coders. After careful consideration, we have decided to move forward with other candidates at this time. We appreciate your time and interest in our organization.`,
      },
      pending: {
        subject: `Application Update: ${escapedPositionTitle}`,
        message: `Your application for the ${escapedPositionTitle} position is currently under review. We will update you as soon as we have more information.`,
      },
    };

    const statusMessage = statusMessages[data.status];

    const emailHtml = `
      <p>Dear ${escapeHtml(existingApplication.firstName)} ${escapeHtml(existingApplication.lastName)},</p>
      <p>${statusMessage.message}</p>
      ${data.notes ? `<p><strong>Additional Notes:</strong><br>${escapeHtmlWithBreaks(data.notes)}</p>` : ""}
      <p>Best regards,<br>Elite Surgical Coders Team</p>
    `;

    try {
      await sendEmail({
        to: existingApplication.email,
        subject: statusMessage.subject,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error("Error sending status update email:", emailError);
      // Don't fail the update if email fails
    }

    return NextResponse.json(
      { message: "Application updated successfully", application },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating application:", error);
    return NextResponse.json(
      { message: "An error occurred updating the application" },
      { status: 500 }
    );
  }
}

