import { promises as fs } from "fs";
import path from "path";

import db from "@/lib/db";
import { fetchFacebookPageFeed, publishFacebookPageNews } from "@/lib/facebook";
import { syncFacebookPostToNews } from "@/lib/facebook-news";

export type FacebookSyncMode = "both" | "facebook-to-system" | "system-to-facebook";

export type FacebookSyncResult = {
  mode: FacebookSyncMode;
  publishedToFacebookCount: number;
  importedFromFacebookCount: number;
  publishErrors: string[];
  importErrors: string[];
  ranAt: string;
  source: string;
};

export type FacebookSyncStatus = {
  ok: boolean;
  mode: FacebookSyncMode;
  source: string;
  publishedToFacebookCount: number;
  importedFromFacebookCount: number;
  publishErrors: string[];
  importErrors?: string[];
  ranAt: string;
  message: string;
};

const SYNC_LOG_DIR = path.join(process.cwd(), "logs");
const SYNC_LOG_FILE = path.join(SYNC_LOG_DIR, "facebook-sync.log");
const SYNC_STATUS_FILE = path.join(SYNC_LOG_DIR, "facebook-sync-status.json");

async function ensureSyncLogDir() {
  await fs.mkdir(SYNC_LOG_DIR, { recursive: true });
}

async function appendSyncLog(line: string) {
  await ensureSyncLogDir();
  await fs.appendFile(SYNC_LOG_FILE, `${line}\n`, "utf8");
}

async function writeSyncStatus(status: FacebookSyncStatus) {
  await ensureSyncLogDir();
  await fs.writeFile(SYNC_STATUS_FILE, JSON.stringify(status, null, 2), "utf8");
}

export async function recordFacebookSyncStatus(status: FacebookSyncStatus) {
  await appendSyncLog(JSON.stringify(status));
  await writeSyncStatus(status);
}

export async function getFacebookSyncStatus(): Promise<FacebookSyncStatus | null> {
  try {
    const raw = await fs.readFile(SYNC_STATUS_FILE, "utf8");
    return JSON.parse(raw) as FacebookSyncStatus;
  } catch {
    return null;
  }
}

export async function runFacebookNewsSync(
  mode: FacebookSyncMode = "both",
  source = "manual",
): Promise<FacebookSyncResult> {
  const pageId = process.env.FACEBOOK_PAGE_ID?.trim();

  if (!pageId) {
    throw new Error("Missing FACEBOOK_PAGE_ID in .env.");
  }

  let publishedToFacebookCount = 0;
  const publishErrors: string[] = [];

  if (mode === "both" || mode === "system-to-facebook") {
    const unpublishedNews = await db.news.findMany({
      where: {
        facebookPostId: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

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
  }

  let importedFromFacebookCount = 0;
  const importErrors: string[] = [];

  if (mode === "both" || mode === "facebook-to-system") {
    try {
      const posts = await fetchFacebookPageFeed(pageId, 25);

      for (const post of posts) {
        if (!post.id) {
          continue;
        }

        try {
          await syncFacebookPostToNews(post, "FACEBOOK_CRON_IMPORT");
          importedFromFacebookCount += 1;
        } catch (error) {
          importErrors.push(
            `${post.id}: ${
              error instanceof Error
                ? error.message
                : "Unknown Facebook import error."
            }`,
          );
        }
      }
    } catch (error) {
      importErrors.push(
        error instanceof Error
          ? error.message
          : "Failed to fetch Facebook page feed.",
      );
    }
  }

  const ranAt = new Date().toISOString();
  const result = {
    mode,
    publishedToFacebookCount,
    importedFromFacebookCount,
    publishErrors,
    importErrors,
    ranAt,
    source,
  };

  const status: FacebookSyncStatus = {
    ok: publishErrors.length === 0 && importErrors.length === 0,
    mode,
    source,
    publishedToFacebookCount,
    importedFromFacebookCount,
    publishErrors,
    importErrors,
    ranAt,
    message:
      publishErrors.length === 0 && importErrors.length === 0
        ? "Facebook sync completed successfully."
        : "Facebook sync completed with errors.",
  };

  await recordFacebookSyncStatus(status);

  return result;
}
