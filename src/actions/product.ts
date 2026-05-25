/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { ProductValidation } from "@/lib/validators";
import { z } from "zod";

const bulkProductRowSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  price: z.number().min(1, { message: "Price is required" }),
  categoryTag: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isPrescriptionRequired: z.boolean().optional(),
  isVatItem: z.boolean().optional(),
  image: z.string().optional(),
});

export const getAllProducts = async () => {
  try {
    const data = await db.products.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orderItems: true,
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

export const getProductById = async (productId: string) => {
  try {
    const data = await db.products.findUnique({
      where: {
        id: productId,
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

export const getProductsCount = async () => {
  try {
    const count = await db.products.count();

    return { data: { count } };
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
        orderItems: true,
      },
      take: 10,
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
          orderItems: true,
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
          orderItems: true,
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
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  const validatedField = ProductValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    name,
    price,
    isPrescriptionRequired,
    isVatItem,
    description,
    image,
    isFeatured,
    categoryTag,
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
        description,
        image,
        isFeatured,
        tags,
        price,
        isVatItem,
        isPrescriptionRequired,
        categoryTag: categoryTag || null,
      },
    });

    return { success: "Product created successfully", data };
  } catch (error: any) {
    console.error("Failed to create product:", error); // Log the error for debugging
    return {
      error: `Failed to create product. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const createProductFromExcel = async (
  values: z.infer<typeof bulkProductRowSchema>
) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  const validatedField = bulkProductRowSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    name,
    description,
    price,
    categoryTag,
    isFeatured,
    isPrescriptionRequired,
    isVatItem,
    image,
  } = validatedField.data;

  const tags = name
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\s+/g, "-")
    .replace(/&/g, "and");

  try {
    const existingProduct = await db.products.findFirst({
      where: {
        OR: [{ tags }, { name: { equals: name, mode: "insensitive" } }],
      },
    });

    if (existingProduct) {
      const data = await db.products.update({
        where: {
          id: existingProduct.id,
        },
        data: {
          name,
          description: description || undefined,
          image: image || undefined,
          isFeatured: isFeatured ?? false,
          tags,
          price,
          isVatItem: isVatItem ?? false,
          isPrescriptionRequired: isPrescriptionRequired ?? false,
          categoryTag: categoryTag || null,
        },
      });

      return {
        updated: true,
        data,
        message: `${name} already exists and was updated.`,
      };
    }

    const data = await db.products.create({
      data: {
        name,
        description: description || undefined,
        image: image || undefined,
        isFeatured: isFeatured ?? false,
        tags,
        price,
        isVatItem: isVatItem ?? false,
        isPrescriptionRequired: isPrescriptionRequired ?? false,
        categoryTag: categoryTag || null,
      },
    });

    return { success: "Product created successfully", data };
  } catch (error: any) {
    console.error("Failed to create product:", error); // Log the error for debugging
    return {
      error: `Failed to create product. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const createBulkProducts = async (data: any[]) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  try {
    const createdProducts: Awaited<
      ReturnType<typeof db.products.create>
    >[] = [];
    const updatedProducts: Awaited<
      ReturnType<typeof db.products.update>
    >[] = [];
    const errors: { name: string; error: string }[] = [];

    for (const product of data) {
      const result = await createProductFromExcel(product);

      if (result.error) {
        errors.push({
          name: product?.name || "Unknown product",
          error: result.error,
        });
        continue;
      }

      if (result.updated) {
        updatedProducts.push(result.data);
        continue;
      }

      if (result.data) {
        createdProducts.push(result.data);
      }
    }

    if (createdProducts.length > 0 || updatedProducts.length > 0) {
      await db.logs.create({
        data: {
          action: `${user.name} bulk uploaded ${createdProducts.length} new and ${updatedProducts.length} updated product(s) at ${new Date().toLocaleString()}`,
          adminId: user.id,
        },
      });
    }

    return {
      success:
        errors.length === 0
          ? "Bulk upload completed successfully."
          : "Bulk upload completed with some failed rows.",
      data: {
        createdCount: createdProducts.length,
        updatedCount: updatedProducts.length,
        errorCount: errors.length,
        createdProducts,
        updatedProducts,
        errors,
      },
    };
  } catch (error) {
    console.error("Error in createBulkProducts:", error);
    return {
      error: error instanceof Error ? error.message : "Bulk upload failed.",
    };
  }
};

export const updateProduct = async (
  values: z.infer<typeof ProductValidation>,
  productId: string
) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!productId) {
    return { error: "Product ID is required." };
  }

  const validatedField = ProductValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    name,
    image,
    description,
    price,
    isFeatured,
    isPrescriptionRequired,
    isVatItem,
    categoryTag,
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
        price,
        isFeatured,
        isPrescriptionRequired,
        isVatItem,
        categoryTag: categoryTag || null,
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
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!productId) {
    return { error: "Product ID is required." };
  }

  try {
    const data = await db.products.delete({
      where: {
        id: productId,
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

    return { success: "Product deleted successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to delete product. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const searchProducts = async (query: string) => {
  try {
    const data = await db.products.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            tags: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        category: true,
      },
    });

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong while searching products." };
  }
};
