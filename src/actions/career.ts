/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { z } from "zod";

const CareerValidation = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  department: z.string().min(1, "Department is required"),
  jobLocation: z.string().min(1, "Job location is required"),
  experienceNeeded: z.enum(["With Experience", "No Experience Required"]),
  yearsOfExperience: z.number().int().min(0).optional(),
  jobDescription: z.string().min(1, "Job description is required"),
  jobQualification: z.string().min(1, "Job qualification is required"),
  isActive: z.boolean().optional().default(true),
});

const CareerApplicationValidation = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  position: z.string().min(1, "Position is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  message: z.string().optional(),
  resumeUrl: z.string().min(1, "Resume is required"),
  careerId: z.string().optional(),
});

// Career CRUD Operations
export const getAllCareers = async () => {
  try {
    const data = await db.career.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        applications: true,
      },
    });

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const getActiveCareers = async () => {
  try {
    const data = await db.career.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const getCareerById = async (careerId: string) => {
  try {
    const data = await db.career.findUnique({
      where: {
        id: careerId,
      },
      include: {
        applications: true,
      },
    });

    if (!data) {
      return { error: "No career found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const createCareer = async (values: z.infer<typeof CareerValidation>) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  const validatedField = CareerValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    jobTitle,
    department,
    jobLocation,
    experienceNeeded,
    yearsOfExperience,
    jobDescription,
    jobQualification,
    isActive,
  } = validatedField.data;

  try {
    const data = await db.career.create({
      data: {
        jobTitle,
        department,
        jobLocation,
        experienceNeeded,
        yearsOfExperience: experienceNeeded === "With Experience" ? yearsOfExperience : null,
        jobDescription,
        jobQualification,
        isActive,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} created career position: ${jobTitle} at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Career created successfully", data };
  } catch (error: any) {
    console.error("Failed to create career:", error);
    return {
      error: `Failed to create career. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateCareer = async (
  values: z.infer<typeof CareerValidation>,
  careerId: string
) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!careerId) {
    return { error: "Career ID is required." };
  }

  const validatedField = CareerValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    jobTitle,
    department,
    jobLocation,
    experienceNeeded,
    yearsOfExperience,
    jobDescription,
    jobQualification,
    isActive,
  } = validatedField.data;

  try {
    const data = await db.career.update({
      where: {
        id: careerId,
      },
      data: {
        jobTitle,
        department,
        jobLocation,
        experienceNeeded,
        yearsOfExperience: experienceNeeded === "With Experience" ? yearsOfExperience : null,
        jobDescription,
        jobQualification,
        isActive,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} updated career position: ${jobTitle} at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Career updated successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to update career. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteCareer = async (careerId: string) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!careerId) {
    return { error: "Career ID is required." };
  }

  try {
    const data = await db.career.delete({
      where: {
        id: careerId,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} deleted career position: ${data.jobTitle} at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Career deleted successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to delete career. Please try again. ${error.message || ""}`,
    };
  }
};

// Career Application Operations
export const getAllApplications = async () => {
  try {
    const data = await db.careerApplication.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        career: true,
      },
    });

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const getApplicationById = async (applicationId: string) => {
  try {
    const data = await db.careerApplication.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        career: true,
      },
    });

    if (!data) {
      return { error: "No application found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const createApplication = async (
  values: z.infer<typeof CareerApplicationValidation>
) => {
  const validatedField = CareerApplicationValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  try {
    const data = await db.careerApplication.create({
      data: {
        firstName: validatedField.data.firstName,
        middleName: validatedField.data.middleName,
        lastName: validatedField.data.lastName,
        position: validatedField.data.position,
        contactNumber: validatedField.data.contactNumber,
        email: validatedField.data.email,
        address: validatedField.data.address,
        message: validatedField.data.message,
        resumeUrl: validatedField.data.resumeUrl,
        careerId: validatedField.data.careerId || null,
        status: "PENDING",
      },
    });

    return { success: "Application submitted successfully", data };
  } catch (error: any) {
    console.error("Failed to create application:", error);
    return {
      error: `Failed to submit application. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: string,
  remarks?: string
) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!applicationId) {
    return { error: "Application ID is required." };
  }

  const validStatuses = ["PENDING", "REVIEWING", "APPROVED", "REJECTED"];
  if (!validStatuses.includes(status)) {
    return { error: "Invalid status." };
  }

  try {
    // Get application data before update for email
    const application = await db.careerApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return { error: "Application not found." };
    }

    // Update application status and remarks
    const data = await db.careerApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status,
        remarks: remarks || null,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} updated application status to ${status} for ${data.firstName} ${data.lastName} at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    // Send email notification (only if status changed from PENDING or if it's a meaningful update)
    if (status !== "PENDING" && application.email) {
      try {
        // Dynamically import to avoid issues with server/client boundaries
        const { sendApplicationStatusEmail } = await import("@/lib/email-notification");
        await sendApplicationStatusEmail({
          to: application.email,
          applicantName: `${application.firstName} ${application.middleName ? application.middleName + " " : ""}${application.lastName}`,
          position: application.position,
          status: status as "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED",
          remarks: remarks || "",
        });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Don't fail the whole operation if email fails
      }
    }

    return { success: "Application status updated successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to update application status. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteApplication = async (applicationId: string) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!applicationId) {
    return { error: "Application ID is required." };
  }

  try {
    const data = await db.careerApplication.delete({
      where: {
        id: applicationId,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} deleted application from ${data.firstName} ${data.lastName} at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Application deleted successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to delete application. Please try again. ${error.message || ""}`,
    };
  }
};

