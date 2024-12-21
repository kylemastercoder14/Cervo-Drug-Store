"use server";

import db from "@/lib/db";

export const getAllLogs = async () => {
  try {
    const data = await db.logs.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!data) {
      return { error: "No logs found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};
