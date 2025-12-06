import { sendEmail } from "./email";
import { render } from "@react-email/render";
import React from "react";
import ApplicationStatusEmail from "@/emails/application-status-email";

interface SendApplicationStatusEmailParams {
  to: string;
  applicantName: string;
  position: string;
  status: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";
  remarks?: string;
}

export async function sendApplicationStatusEmail({
  to,
  applicantName,
  position,
  status,
  remarks = "",
}: SendApplicationStatusEmailParams) {
  // Render the email template
  const emailHtml = await render(
    React.createElement(ApplicationStatusEmail, {
      applicantName,
      position,
      status,
      remarks,
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
    throw new Error(result.error);
  }

  return result;
}

