/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { InventoryValidation } from "@/lib/validators";
import { z } from "zod";

export const getAllInventory = async () => {
  try {
    const data = await db.inventory.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        product: true,
      },
    });

    if (!data) {
      return { error: "No inventory found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const createInventory = async (
  values: z.infer<typeof InventoryValidation>
) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  const validatedField = InventoryValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { productId, stock } = validatedField.data;

  try {
    const existingInventory = await db.inventory.findFirst({
      where: {
        productId: productId,
      },
    });

    if (existingInventory) {
      return {
        error:
          "Inventory already exists for this product. Please update the stock.",
      };
    }

    const data = await db.inventory.create({
      data: {
        productId: productId,
        quantity: stock,
      },
      include: {
        product: true,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} added a stock of ${data.quantity} for ${
          data.product.name
        } at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Inventory created successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to create inventory. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updateInventory = async (
  values: z.infer<typeof InventoryValidation>,
  inventoryId: string
) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!inventoryId) {
    return { error: "Inventory ID is required." };
  }

  const validatedField = InventoryValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { productId, stock } = validatedField.data;

  try {
    const data = await db.inventory.update({
      where: {
        id: inventoryId,
      },
      data: {
        productId: productId,
        quantity: stock,
      },
      include: {
        product: true,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} updated a stock of ${data.quantity} for ${
          data.product.name
        } at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Inventory updated successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to update inventory. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteInventory = async (inventoryId: string) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!inventoryId) {
    return { error: "Inventory ID is required." };
  }

  try {
    const data = await db.inventory.delete({
      where: {
        id: inventoryId,
      },
      include: {
        product: true,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} deleted inventory for ${
          data.product.name
        } at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Inventory deleted successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to delete inventory. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
