"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";

export const getAllCustomers = async () => {
  try {
    const data = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!data) {
      return { error: "No customer found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const deleteCustomer = async (customerId: string) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!customerId) {
    return { error: "Customer ID is required." };
  }

  try {
    const data = await db.user.delete({
      where: {
        id: customerId,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} deleted a customer ${
          data.firstName
        } ${data.lastName} at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Customer deleted successfully", data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";

    return {
      error: `Failed to delete customer. Please try again. ${
        message || ""
      }`,
    };
  }
};
