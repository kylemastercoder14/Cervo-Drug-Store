/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { StaffValidation } from "@/lib/validators";
import { z } from "zod";
import * as jose from "jose";
import { cookies } from "next/headers";

export const getAllStaff = async () => {
  try {
    const data = await db.admin.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!data) {
      return { error: "No staff found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const staff = await db.admin.findFirst({
      where: {
        email,
      },
    });

    if (!staff) {
      return { error: "User not found" };
    }

    if (staff.password !== password) {
      return { error: "Invalid Password" };
    }

    await db.logs.create({
      data: {
        action: `${staff.name} logged in on ${new Date().toLocaleString()}`,
        adminId: staff?.id || "",
      },
    });

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const jwt = await new jose.SignJWT({})
      .setProtectedHeader({ alg })
      .setExpirationTime("72h")
      .setSubject(staff.id.toString())
      .sign(secret);

    // Set the cookie with the JWT
    (await cookies()).set("Authorization", jwt, {
      httpOnly: true, // Set to true for security
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 3, // Cookie expiration (3 days in seconds)
      sameSite: "strict", // Adjust according to your needs
      path: "/", // Adjust path as needed
    });

    return { token: jwt };
  } catch (error: any) {
    return {
      error: `Failed to sign in user. Please try again. ${error.message || ""}`,
    };
  }
};

export const logout = async () => {
  (await cookies()).set("Authorization", "", { maxAge: 0, path: "/" });
};

export const updateCurrentAdminAccount = async (values: {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  const name = values.name?.trim();
  const email = values.email?.trim();
  const currentPassword = values.currentPassword?.trim();
  const newPassword = values.newPassword?.trim();
  const confirmPassword = values.confirmPassword?.trim();

  if (!name) {
    return { error: "Name is required." };
  }

  if (!email) {
    return { error: "Email is required." };
  }

  if (newPassword || confirmPassword || currentPassword) {
    if (!currentPassword) {
      return { error: "Current password is required." };
    }

    if (user.password !== currentPassword) {
      return { error: "Current password is incorrect." };
    }

    if (!newPassword || newPassword.length < 6) {
      return { error: "New password must be at least 6 characters." };
    }

    if (newPassword !== confirmPassword) {
      return { error: "New passwords do not match." };
    }
  }

  try {
    const updatedAdmin = await db.admin.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        email,
        ...(newPassword ? { password: newPassword } : {}),
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} updated account settings at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Account settings updated successfully.", data: updatedAdmin };
  } catch (error: any) {
    return {
      error: `Failed to update account settings. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const createStaff = async (values: z.infer<typeof StaffValidation>) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  const validatedField = StaffValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, email, password, role, branch } = validatedField.data;

  try {
    const data = await db.admin.create({
      data: {
        name,
        email,
        password,
        role,
        branch,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} added ${data.name} as ${
          data.role
        } at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Staff created successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to create staff. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateStaff = async (
  values: z.infer<typeof StaffValidation>,
  staffId: string
) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!staffId) {
    return { error: "Staff is required." };
  }

  const validatedField = StaffValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, email, password, role, branch } = validatedField.data;

  try {
    const data = await db.admin.update({
      where: {
        id: staffId,
      },
      data: {
        name,
        email,
        password,
        role,
        branch,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} updated ${
          data.name
        } at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Staff updated successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to update staff. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteStaff = async (staffId: string) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!staffId) {
    return { error: "Staff ID is required." };
  }

  try {
    const data = await db.admin.delete({
      where: {
        id: staffId,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} deleted ${
          data.name
        } at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Staff deleted successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to delete staff. Please try again. ${error.message || ""}`,
    };
  }
};
