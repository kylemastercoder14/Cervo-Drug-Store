/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { BannerValidation } from "@/lib/validators";
import { z } from "zod";

export const getAllBanner = async () => {
  try {
    const data = await db.banner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!data) {
      return { error: "No banner found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const createBanner = async (
  values: z.infer<typeof BannerValidation>
) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  const validatedField = BannerValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { image } = validatedField.data;

  try {
    const data = await db.banner.create({
      data: {
        image,
      },
    });

    await db.logs.create({
      data: {
        action: `${
          user.name
        } created a banner at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Banner created successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to create banner. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updateBanner = async (
  values: z.infer<typeof BannerValidation>,
  bannerId: string
) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!bannerId) {
    return { error: "Banner ID is required." };
  }

  const validatedField = BannerValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { image } = validatedField.data;

  try {
    const data = await db.banner.update({
      where: {
        id: bannerId,
      },
      data: {
        image,
      },
    });

    await db.logs.create({
      data: {
        action: `${
          user.name
        } updated a banner ${bannerId} at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Banner updated successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to update banner. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteBanner = async (bannerId: string) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!bannerId) {
    return { error: "Banner ID is required." };
  }

  try {
    const data = await db.banner.delete({
      where: {
        id: bannerId,
      },
    });

    await db.logs.create({
      data: {
        action: `${
          user.name
        } deleted a banner ${bannerId} at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Banner deleted successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to delete banner. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
