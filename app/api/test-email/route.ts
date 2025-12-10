import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

/**
 * Test endpoint to verify email configuration
 * Visit: http://localhost:3000/api/test-email
 */
export async function GET() {
  try {
    // Check if email credentials are configured
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = process.env.SMTP_PORT || "587";
    const testEmail = process.env.INTERNAL_NOTIFICATION_EMAIL || smtpUser;

    if (!smtpUser || !smtpPass) {
      return NextResponse.json(
        {
          success: false,
          error: "SMTP credentials not configured",
          details: {
            SMTP_USER: smtpUser ? "✅ Set" : "❌ Missing",
            SMTP_PASS: smtpPass ? "✅ Set" : "❌ Missing",
            SMTP_HOST: smtpHost,
            SMTP_PORT: smtpPort,
          },
          instructions: [
            "1. Open your .env file",
            "2. Add SMTP_USER=your-email@gmail.com",
            "3. Add SMTP_PASS=your-app-password",
            "4. Restart your server (npm run dev)",
          ],
        },
        { status: 400 }
      );
    }

    if (!testEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "No test email address configured",
          details: {
            INTERNAL_NOTIFICATION_EMAIL: "Not set",
            SMTP_USER: smtpUser,
          },
          instructions: [
            "Set INTERNAL_NOTIFICATION_EMAIL in .env file",
            "Or use SMTP_USER as the test email",
          ],
        },
        { status: 400 }
      );
    }

    // Try to send a test email
    try {
      await sendEmail({
        to: testEmail,
        subject: "✅ Email Test - Elite Surgical Coders",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #211f50;">Email Configuration Test</h2>
            <p style="color: #333;">Congratulations! Your email configuration is working correctly.</p>
            <div style="background-color: #f8f8f8; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>SMTP Host:</strong> ${smtpHost}</p>
              <p style="margin: 5px 0;"><strong>SMTP Port:</strong> ${smtpPort}</p>
              <p style="margin: 5px 0;"><strong>From Email:</strong> ${smtpUser}</p>
              <p style="margin: 5px 0;"><strong>Test Email:</strong> ${testEmail}</p>
            </div>
            <p style="color: #666; font-size: 14px;">If you received this email, your contact form emails will work correctly.</p>
          </div>
        `,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Email test successful! Check your inbox.",
          details: {
            to: testEmail,
            from: smtpUser,
            smtpHost,
            smtpPort,
          },
          note: "If you don't see the email, check your spam folder.",
        },
        { status: 200 }
      );
    } catch (emailError) {
      const errorMessage = emailError instanceof Error ? emailError.message : "Unknown error";
      
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send test email",
          errorMessage,
          details: {
            smtpHost,
            smtpPort,
            smtpUser,
            testEmail,
          },
          commonIssues: [
            "1. Invalid App Password - Generate new one from Google Account",
            "2. 2-Step Verification not enabled - Enable it first",
            "3. Wrong SMTP settings - Check host and port",
            "4. Firewall blocking connection - Check antivirus/firewall",
          ],
          instructions: [
            "For Gmail:",
            "- Go to: https://myaccount.google.com/apppasswords",
            "- Generate App Password (not regular password)",
            "- Use 16-character password without spaces",
            "- Make sure 2-Step Verification is enabled",
          ],
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Unexpected error",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

