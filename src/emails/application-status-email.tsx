import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface ApplicationStatusEmailProps {
  applicantName: string;
  position: string;
  status: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";
  remarks?: string;
}

export default function ApplicationStatusEmail({
  applicantName,
  position,
  status,
  remarks = "",
}: ApplicationStatusEmailProps) {
  const getStatusColor = () => {
    switch (status) {
      case "APPROVED":
        return "#22c55e"; // green
      case "REVIEWING":
        return "#3b82f6"; // blue
      case "REJECTED":
        return "#ef4444"; // red
      default:
        return "#6b7280"; // gray
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "APPROVED":
        return {
          title: "Congratulations!",
          message: "We are pleased to inform you that your application has been approved.",
        };
      case "REVIEWING":
        return {
          title: "Application Under Review",
          message: "Your application is currently being reviewed by our hiring team.",
        };
      case "REJECTED":
        return {
          title: "Application Update",
          message: "We regret to inform you that we are unable to proceed with your application at this time.",
        };
      default:
        return {
          title: "Application Update",
          message: "There has been an update to your application status.",
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <Html>
      <Head />
      <Preview>{statusInfo.message}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Cervo Drug Store</Heading>
            <Text style={subtitle}>Career Application Update</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Dear {applicantName},</Text>

            <Text style={paragraph}>
              {statusInfo.message}
            </Text>

            <Section style={statusBox}>
              <Text style={statusLabel}>Position Applied:</Text>
              <Text style={statusValue}>{position}</Text>

              <Text style={statusLabel}>Status:</Text>
              <Text
                style={{
                  ...statusValue,
                  color: getStatusColor(),
                  fontWeight: "bold",
                }}
              >
                {status}
              </Text>
            </Section>

            {remarks && (
              <>
                <Hr style={hr} />
                <Text style={remarksLabel}>Remarks:</Text>
                <Section style={remarksBox}>
                  <Text style={remarksText}>{remarks}</Text>
                </Section>
              </>
            )}

            {status === "APPROVED" && (
              <Section style={nextStepsBox}>
                <Heading style={h2}>Next Steps</Heading>
                <Text style={paragraph}>
                  Our HR team will contact you shortly to discuss the next steps in the hiring process.
                  Please keep an eye on your email and phone for further communication.
                </Text>
              </Section>
            )}

            {status === "REVIEWING" && (
              <Section style={nextStepsBox}>
                <Text style={paragraph}>
                  We will notify you as soon as we have completed our review process.
                  Thank you for your patience.
                </Text>
              </Section>
            )}

            {status === "REJECTED" && (
              <Section style={nextStepsBox}>
                <Text style={paragraph}>
                  We appreciate your interest in joining our team. We encourage you to apply for
                  other positions that may be a better fit for your skills and experience.
                </Text>
              </Section>
            )}
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              If you have any questions, please don't hesitate to contact us.
            </Text>
            <Text style={footerText}>
              <Link href="mailto:cervowebsite@gmail.com" style={link}>
                cervowebsite@gmail.com
              </Link>
            </Text>
            <Text style={footerText}>
              <Link href="tel:+639328567585" style={link}>
                (+63) 9328567585 / 8696-7088
              </Link>
            </Text>
            <Text style={footerTextSmall}>
              This is an automated email. Please do not reply to this message.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const header = {
  padding: "32px 24px",
  backgroundColor: "#437634",
  textAlign: "center" as const,
};

const h1 = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0 0 8px",
  textAlign: "center" as const,
};

const subtitle = {
  color: "#e5e7eb",
  fontSize: "16px",
  margin: "0",
  textAlign: "center" as const,
};

const content = {
  padding: "24px",
};

const greeting = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#1f2937",
  marginBottom: "16px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#374151",
  marginBottom: "16px",
};

const statusBox = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const statusLabel = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#6b7280",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
};

const statusValue = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1f2937",
  margin: "0 0 16px",
};

const remarksBox = {
  backgroundColor: "#fef3c7",
  border: "1px solid #fbbf24",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
};

const remarksLabel = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#92400e",
  margin: "0 0 8px",
};

const remarksText = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#78350f",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const nextStepsBox = {
  backgroundColor: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const h2 = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#1e40af",
  margin: "0 0 12px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const footer = {
  padding: "24px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#6b7280",
  margin: "0 0 8px",
};

const footerTextSmall = {
  fontSize: "12px",
  lineHeight: "20px",
  color: "#9ca3af",
  margin: "16px 0 0",
};

const link = {
  color: "#437634",
  textDecoration: "underline",
};

