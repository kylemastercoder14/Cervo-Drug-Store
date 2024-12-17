/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { PromotionValidation } from "@/lib/validators";
import { z } from "zod";

export const getAllPromotion = async () => {
  try {
    const data = await db.promotions.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!data) {
      return { error: "No promotion found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const getFeaturedPromotion = async () => {
  try {
    const data = await db.promotions.findMany({
      orderBy: {
        createdAt: "asc",
      },
      where: {
        isFeatured: true,
      },
      take: 3
    });

    if (!data) {
      return { error: "No promotion found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const createPromotion = async (
  values: z.infer<typeof PromotionValidation>
) => {
  const validatedField = PromotionValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { image, isFeatured } = validatedField.data;

  try {
    const data = await db.promotions.create({
      data: {
        image,
        isFeatured,
      },
    });

    return { success: "Promotion created successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to create promotion. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updatePromotion = async (
  values: z.infer<typeof PromotionValidation>,
  promotionId: string
) => {
  if (!promotionId) {
    return { error: "Promotion ID is required." };
  }

  const validatedField = PromotionValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { image, isFeatured } = validatedField.data;

  try {
    const data = await db.promotions.update({
      where: {
        id: promotionId,
      },
      data: {
        image,
        isFeatured,
      },
    });

    return { success: "Promotion updated successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to update promotion. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deletePromotion = async (promotionId: string) => {
  if (!promotionId) {
    return { error: "Promotion ID is required." };
  }

  try {
    const data = await db.promotions.delete({
      where: {
        id: promotionId,
      },
    });

    return { success: "Promotion deleted successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to delete promotion. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
