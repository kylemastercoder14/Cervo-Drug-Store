/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { ProductValidation } from "@/lib/validators";
import { z } from "zod";

export const getAllProducts = async () => {
  try {
    const data = await db.products.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
      },
    });

    if (!data) {
      return { error: "No products found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const getFeaturedProducts = async () => {
  try {
    const data = await db.products.findMany({
      orderBy: {
        createdAt: "asc",
      },
      where: {
        isFeatured: true,
      },
      include: {
        category: true,
      },
      take: 10
    });

    if (!data) {
      return { error: "No products found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const getProductByTag = async (tags: string) => {
  try {
    const data = await db.products.findFirst({
      orderBy: {
        createdAt: "asc",
      },
      where: {
        tags,
      },
      include: {
        category: true,
      },
    });

    if (!data) {
      return { error: "No product found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const getProductsByCategory = async (categoryTag: string) => {
  try {
    let data;
    if (categoryTag === "all") {
      data = await db.products.findMany({
        orderBy: {
          createdAt: "asc",
        },
        include: {
          category: true,
        },
      });
    } else {
      data = await db.products.findMany({
        orderBy: {
          createdAt: "asc",
        },
        where: {
          categoryTag: categoryTag,
        },
        include: {
          category: true,
        },
      });
    }

    // Check if the data array is empty
    if (!data || data.length === 0) {
      return { error: "No products found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong while fetching products." };
  }
};

export const createProduct = async (
  values: z.infer<typeof ProductValidation>
) => {
  const validatedField = ProductValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    name,
    image,
    description,
    price,
    category,
    isFeatured,
    isPrescriptionRequired,
    discountedPrice,
  } = validatedField.data;

  const tags = name
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\s+/g, "-")
    .replace(/&/g, "and");

  try {
    const data = await db.products.create({
      data: {
        name,
        image,
        tags,
        description,
        categoryTag: category,
        price,
        isFeatured,
        discountedPrice,
        isPrescriptionRequired,
      },
    });

    return { success: "Product created successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to create product. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updateProduct = async (
  values: z.infer<typeof ProductValidation>,
  productId: string
) => {
  if (!productId) {
    return { error: "Product ID is required." };
  }

  const validatedField = ProductValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    name,
    image,
    description,
    price,
    category,
    isFeatured,
    isPrescriptionRequired,
    discountedPrice,
  } = validatedField.data;

  const tags = name
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\s+/g, "-")
    .replace(/&/g, "and");

  try {
    const data = await db.products.update({
      where: {
        id: productId,
      },
      data: {
        name,
        image,
        tags,
        description,
        categoryTag: category,
        price,
        isFeatured,
        isPrescriptionRequired,
        discountedPrice,
      },
    });

    return { success: "Product updated successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to update product. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteProduct = async (productId: string) => {
  if (!productId) {
    return { error: "Product ID is required." };
  }

  try {
    const data = await db.products.delete({
      where: {
        id: productId,
      },
    });

    return { success: "Product deleted successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to delete product. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
