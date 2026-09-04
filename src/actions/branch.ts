/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { BranchValidation } from "@/lib/validators";
import { z } from "zod";

export const getAllBranches = async () => {
  try {
    const data = await db.branch.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!data) {
      return { error: "No branches found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const createBranch = async (
  values: z.infer<typeof BranchValidation>
) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  const validatedField = BranchValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  try {
    const data = await db.branch.create({
      data: validatedField.data,
    });

    await db.logs.create({
      data: {
        action: `${user.name} created a branch ${
          data.name
        } at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Branch created successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to create branch. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updateBranch = async (
  values: z.infer<typeof BranchValidation>,
  branchId: string
) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!branchId) {
    return { error: "Branch ID is required." };
  }

  const validatedField = BranchValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  try {
    const data = await db.branch.update({
      where: {
        id: branchId,
      },
      data: validatedField.data,
    });

    await db.logs.create({
      data: {
        action: `${user.name} updated a branch ${
          data.name
        } at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Branch updated successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to update branch. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteBranch = async (branchId: string) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!branchId) {
    return { error: "Branch ID is required." };
  }

  try {
    const data = await db.branch.delete({
      where: {
        id: branchId,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} deleted a branch ${
          data.name
        } at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Branch deleted successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to delete branch. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
