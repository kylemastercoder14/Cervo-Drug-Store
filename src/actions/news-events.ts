/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { fetchFacebookPageFeed, publishFacebookPageNews } from "@/lib/facebook";
import { syncFacebookPostToNews } from "@/lib/facebook-news";
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
    const errors = validatedField.error.issues.map((err) => err.message);
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
    const errors = validatedField.error.issues.map((err) => err.message);
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

export const publishExistingNewsEventsToFacebook = async () => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  const pageId = process.env.FACEBOOK_PAGE_ID?.trim();

  if (!pageId) {
    return { error: "Missing FACEBOOK_PAGE_ID in .env." };
  }

  try {
    const unpublishedNews = await db.news.findMany({
      where: {
        facebookPostId: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    let publishedCount = 0;
    const errors: string[] = [];

    for (const item of unpublishedNews) {
      try {
        const result = await publishFacebookPageNews(pageId, {
          newsId: item.id,
          title: item.title,
          content: item.content,
          image: item.image,
          link: process.env.NEXT_PUBLIC_APP_URL?.trim()
            ? `${process.env.NEXT_PUBLIC_APP_URL.trim()}/#blogs`
            : undefined,
        });

        await db.news.update({
          where: {
            id: item.id,
          },
          data: {
            facebookPostId: result.postId,
            facebookPermalink: result.permalinkUrl || null,
            facebookPublishedAt: new Date(),
            facebookSyncSource: "APP_BULK_PUBLISH",
            lastFacebookSyncAt: new Date(),
          },
        });

        publishedCount += 1;
      } catch (error) {
        errors.push(
          `${item.title}: ${
            error instanceof Error ? error.message : "Unknown Facebook publish error."
          }`,
        );
      }
    }

    await db.logs.create({
      data: {
        action: `${user.name} bulk published ${publishedCount} news/event post(s) to Facebook at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return {
      success: `Published ${publishedCount} news/event post(s) to Facebook.`,
      data: {
        publishedCount,
        skippedCount: unpublishedNews.length - publishedCount,
        errors,
      },
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to publish existing news/events to Facebook.",
    };
  }
};

export const syncFacebookPostsToNews = async () => {
  const { user } = await getUserFromCookies();

  if (!user) {
    return { error: "User not found." };
  }

  const pageId = process.env.FACEBOOK_PAGE_ID?.trim();

  if (!pageId) {
    return { error: "Missing FACEBOOK_PAGE_ID in .env." };
  }

  try {
    const posts = await fetchFacebookPageFeed(pageId, 25);
    let syncedCount = 0;

    for (const post of posts) {
      if (!post.id) {
        continue;
      }

      await syncFacebookPostToNews(post, "FACEBOOK_IMPORT");
      syncedCount += 1;
    }

    await db.logs.create({
      data: {
        action: `${user.name} imported ${syncedCount} Facebook page post(s) into news/events at ${new Date().toLocaleString()}`,
        adminId: user.id,
      },
    });

    return {
      success: `Imported ${syncedCount} Facebook post(s) into news/events.`,
      data: {
        syncedCount,
      },
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to sync Facebook posts into news/events.",
    };
  }
};
