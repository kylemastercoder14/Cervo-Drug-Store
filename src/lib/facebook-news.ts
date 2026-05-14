import db from "@/lib/db";
import { FacebookGraphPost, stripHtml } from "@/lib/facebook";

const DEFAULT_NEWS_IMAGE = "/images/logo.png";

const deriveTitleFromMessage = (message?: string, createdTime?: string) => {
  const cleaned = stripHtml(message || "");
  const firstLine = cleaned
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  if (firstLine) {
    return firstLine.length > 120 ? `${firstLine.slice(0, 117).trim()}...` : firstLine;
  }

  if (createdTime) {
    return `Facebook post - ${new Date(createdTime).toLocaleDateString()}`;
  }

  return "Facebook post";
};

export async function syncFacebookPostToNews(
  post: FacebookGraphPost,
  source: "FACEBOOK_WEBHOOK" | "FACEBOOK_IMPORT" = "FACEBOOK_WEBHOOK",
) {
  const title = deriveTitleFromMessage(post.message, post.created_time);
  const message = stripHtml(post.message || "");
  const content = message || post.permalink_url || title;
  const image = post.full_picture?.trim() || DEFAULT_NEWS_IMAGE;
  const createdAt = post.created_time ? new Date(post.created_time) : undefined;

  const existingByFacebookId = await db.news.findUnique({
    where: {
      facebookPostId: post.id,
    },
  });

  if (existingByFacebookId) {
    return db.news.update({
      where: {
        id: existingByFacebookId.id,
      },
      data: {
        title,
        content,
        image,
        facebookPermalink: post.permalink_url || null,
        facebookPublishedAt: createdAt,
        facebookSyncSource: source,
        lastFacebookSyncAt: new Date(),
      },
    });
  }

  return db.news.create({
    data: {
      title,
      content,
      image,
      facebookPostId: post.id,
      facebookPermalink: post.permalink_url || null,
      facebookPublishedAt: createdAt,
      facebookSyncSource: source,
      lastFacebookSyncAt: new Date(),
      ...(createdAt ? { createdAt } : {}),
    },
  });
}
