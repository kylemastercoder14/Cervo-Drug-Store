import db from "@/lib/db";
import { FacebookGraphPost, stripHtml } from "@/lib/facebook";
import { uploadBufferToPublicStorage } from "@/lib/server-upload";

const DEFAULT_NEWS_IMAGE = "/images/logo.png";
const VIDEO_EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
  "video/x-msvideo": "avi",
};

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

const sanitizeStorageName = (value: string) =>
  value.replace(/[^a-zA-Z0-9_-]/g, "-");

const extensionFromContentType = (contentType: string | null) => {
  if (!contentType) {
    return "mp4";
  }

  return VIDEO_EXTENSION_BY_CONTENT_TYPE[contentType.split(";")[0].trim()] || "mp4";
};

async function downloadFacebookVideo(post: FacebookGraphPost) {
  const videoUrl = post.video_source_url?.trim();

  if (!videoUrl) {
    return null;
  }

  const response = await fetch(videoUrl);

  if (!response.ok) {
    throw new Error(`Failed to download Facebook video for post ${post.id}.`);
  }

  const contentType = response.headers.get("content-type");
  const extension = extensionFromContentType(contentType);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const storageKey = `uploads/facebook-videos/${sanitizeStorageName(
    post.id,
  )}-${Date.now()}.${extension}`;

  const result = await uploadBufferToPublicStorage({
    buffer,
    key: storageKey,
    contentType: contentType || "video/mp4",
  });

  return result.url;
}

async function tryDownloadFacebookVideo(post: FacebookGraphPost) {
  try {
    return await downloadFacebookVideo(post);
  } catch (error) {
    console.error("Failed to sync Facebook video:", error);
    return null;
  }
}

export async function syncFacebookPostToNews(
  post: FacebookGraphPost,
  source:
    | "FACEBOOK_WEBHOOK"
    | "FACEBOOK_IMPORT"
    | "FACEBOOK_CRON_IMPORT" = "FACEBOOK_WEBHOOK",
) {
  const title = deriveTitleFromMessage(post.message, post.created_time);
  const message = stripHtml(post.message || "");
  const content = message || post.permalink_url || title;
  const image =
    post.video_thumbnail_url?.trim() ||
    post.full_picture?.trim() ||
    DEFAULT_NEWS_IMAGE;
  const createdAt = post.created_time ? new Date(post.created_time) : undefined;

  const existingByFacebookId = await db.news.findUnique({
    where: {
      facebookPostId: post.id,
    },
  });

  if (existingByFacebookId) {
    const videoUrl =
      existingByFacebookId.videoUrl || (await tryDownloadFacebookVideo(post));

    return db.news.update({
      where: {
        id: existingByFacebookId.id,
      },
      data: {
        title,
        content,
        image,
        videoUrl,
        facebookPermalink: post.permalink_url || null,
        facebookPublishedAt: createdAt,
        facebookSyncSource: source,
        lastFacebookSyncAt: new Date(),
      },
    });
  }

  const videoUrl = await tryDownloadFacebookVideo(post);

  return db.news.create({
    data: {
      title,
      content,
      image,
      videoUrl,
      facebookPostId: post.id,
      facebookPermalink: post.permalink_url || null,
      facebookPublishedAt: createdAt,
      facebookSyncSource: source,
      lastFacebookSyncAt: new Date(),
      ...(createdAt ? { createdAt } : {}),
    },
  });
}
