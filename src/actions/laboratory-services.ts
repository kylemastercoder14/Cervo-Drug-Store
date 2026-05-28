/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { LaboratoryServiceValidation } from "@/lib/validators";
import { z } from "zod";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const parseServices = (servicesText: string) =>
  servicesText
    .split(/\r?\n/)
    .map((service) => service.trim())
    .filter(Boolean);

export const getAllLaboratoryServiceCategories = async () => {
  try {
    const data = await db.laboratoryServiceCategory.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const getActiveLaboratoryServiceCategories = async () => {
  try {
    const data = await db.laboratoryServiceCategory.findMany({
      where: {
        isActive: true,
      },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const getLaboratoryServiceCategoryBySlug = async (slug: string) => {
  try {
    const data = await db.laboratoryServiceCategory.findUnique({
      where: {
        slug,
      },
    });

    if (!data || !data.isActive) {
      return { error: "Laboratory service category not found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const createLaboratoryServiceCategory = async (
  values: z.infer<typeof LaboratoryServiceValidation>,
) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  const validatedField = LaboratoryServiceValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, description, servicesText, displayOrder, isActive } =
    validatedField.data;
  const services = parseServices(servicesText);

  if (services.length === 0) {
    return { error: "Add at least one laboratory service." };
  }

  try {
    const data = await db.laboratoryServiceCategory.create({
      data: {
        name,
        slug: slugify(name),
        description: description?.trim() || null,
        services,
        displayOrder: displayOrder || 0,
        isActive: isActive ?? true,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} added laboratory service category ${
          data.name
        } at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Laboratory service category created successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to create laboratory service category. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updateLaboratoryServiceCategory = async (
  values: z.infer<typeof LaboratoryServiceValidation>,
  categoryId: string,
) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!categoryId) {
    return { error: "Laboratory service category ID is required." };
  }

  const validatedField = LaboratoryServiceValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, description, servicesText, displayOrder, isActive } =
    validatedField.data;
  const services = parseServices(servicesText);

  if (services.length === 0) {
    return { error: "Add at least one laboratory service." };
  }

  try {
    const data = await db.laboratoryServiceCategory.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        slug: slugify(name),
        description: description?.trim() || null,
        services,
        displayOrder: displayOrder || 0,
        isActive: isActive ?? true,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} updated laboratory service category ${
          data.name
        } at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Laboratory service category updated successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to update laboratory service category. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteLaboratoryServiceCategory = async (categoryId: string) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!categoryId) {
    return { error: "Laboratory service category ID is required." };
  }

  try {
    const data = await db.laboratoryServiceCategory.delete({
      where: {
        id: categoryId,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} deleted laboratory service category ${
          data.name
        } at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Laboratory service category deleted successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to delete laboratory service category. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
