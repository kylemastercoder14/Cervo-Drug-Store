import db from "@/lib/db";
import { fetchFacebookPageFeed, publishFacebookPageNews } from "@/lib/facebook";
import { syncFacebookPostToNews } from "@/lib/facebook-news";

type FacebookSyncResult = {
  publishedToFacebookCount: number;
  importedFromFacebookCount: number;
  publishErrors: string[];
};

export async function runFacebookNewsSync(): Promise<FacebookSyncResult> {
  const pageId = process.env.FACEBOOK_PAGE_ID?.trim();

  if (!pageId) {
    throw new Error("Missing FACEBOOK_PAGE_ID in .env.");
  }

  const unpublishedNews = await db.news.findMany({
    where: {
      facebookPostId: null,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  let publishedToFacebookCount = 0;
  const publishErrors: string[] = [];

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
          facebookSyncSource: "CRON_PUBLISH",
          lastFacebookSyncAt: new Date(),
        },
      });

      publishedToFacebookCount += 1;
    } catch (error) {
      publishErrors.push(
        `${item.title}: ${
          error instanceof Error ? error.message : "Unknown Facebook publish error."
        }`,
      );
    }
  }

  const posts = await fetchFacebookPageFeed(pageId, 25);
  let importedFromFacebookCount = 0;

  for (const post of posts) {
    if (!post.id) {
      continue;
    }

    await syncFacebookPostToNews(post, "FACEBOOK_CRON_IMPORT");
    importedFromFacebookCount += 1;
  }

  return {
    publishedToFacebookCount,
    importedFromFacebookCount,
    publishErrors,
  };
}
