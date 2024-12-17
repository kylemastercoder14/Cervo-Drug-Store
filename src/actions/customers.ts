"use server";

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
