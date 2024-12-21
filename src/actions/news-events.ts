/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { NewsEventValidation } from "@/lib/validators";
import { z } from "zod";

export const getAllNewsEvents = async () => {
  try {
    const data = await db.news.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!data) {
      return { error: "No news and events found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const createNewsEvent = async (
  values: z.infer<typeof NewsEventValidation>
) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  const validatedField = NewsEventValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { image, title, content } = validatedField.data;

  try {
    const data = await db.news.create({
      data: {
        image,
        title,
        content,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} added ${
          data.title
        } for news/events at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "News/event created successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to create news/event. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updateNewsEvent = async (
  values: z.infer<typeof NewsEventValidation>,
  newsId: string
) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!newsId) {
    return { error: "News/Event ID is required." };
  }

  const validatedField = NewsEventValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { image, title, content } = validatedField.data;

  try {
    const data = await db.news.update({
      where: {
        id: newsId,
      },
      data: {
        image,
        content,
        title,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} updated ${
          data.title
        } for news/events at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "News/event updated successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to update news/event. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteNewsEvent = async (newsId: string) => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  if (!newsId) {
    return { error: "News/Event ID is required." };
  }

  try {
    const data = await db.news.delete({
      where: {
        id: newsId,
      },
    });

    await db.logs.create({
      data: {
        action: `${user.name} deleted ${
          data.title
        } at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return { success: "News/event deleted successfully", data };
  } catch (error: any) {
    return {
      error: `Failed to delete news/event. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
