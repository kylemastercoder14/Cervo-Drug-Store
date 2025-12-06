import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { render } from "@react-email/render";
import ApplicationStatusEmail from "@/emails/application-status-email";
import React from "react";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, applicantName, position, status, remarks } = body;

    if (!to || !applicantName || !position || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Render the email template
    const emailHtml = await render(
      React.createElement(ApplicationStatusEmail, {
        applicantName,
        position,
        status: status as "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED",
        remarks: remarks || "",
      })
    );

    // Determine subject based on status
    let subject = "";
    switch (status) {
      case "APPROVED":
        subject = `Congratulations! Your Application for ${position} Has Been Approved`;
        break;
      case "REVIEWING":
        subject = `Update on Your Application for ${position}`;
        break;
      case "REJECTED":
        subject = `Update on Your Application for ${position}`;
        break;
      default:
        subject = `Update on Your Application for ${position}`;
    }

    // Send email
    const result = await sendEmail({
      to,
      subject,
      html: emailHtml,
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error: any) {
    console.error("Error in send-application-email route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}

