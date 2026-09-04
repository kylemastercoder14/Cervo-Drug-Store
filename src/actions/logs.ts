"use server";

import { getUserFromCookies } from "@/hooks/use-user";
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

export const deleteLog = async (logId: string) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!logId) {
    return { error: "Log ID is required." };
  }

  try {
    const data = await db.logs.delete({
      where: {
        id: logId,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} deleted a log at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "Log deleted successfully", data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";

    return {
      error: `Failed to delete log. Please try again. ${message || ""}`,
    };
  }
};
