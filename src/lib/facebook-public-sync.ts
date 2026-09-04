import { getFacebookSyncStatus, runFacebookNewsSync } from "@/lib/facebook-sync";

const WEBSITE_SYNC_INTERVAL_MS = 2 * 60 * 1000;
let lastWebsiteSyncAttempt = 0;

export async function syncFacebookPostsForWebsite(source: string) {
  if (!process.env.FACEBOOK_PAGE_ID?.trim()) {
    return;
  }

  const now = Date.now();
  if (now - lastWebsiteSyncAttempt < WEBSITE_SYNC_INTERVAL_MS) {
    return;
  }

  try {
    const status = await getFacebookSyncStatus();
    const lastRunAt = status?.ranAt ? new Date(status.ranAt).getTime() : 0;

    if (lastRunAt && now - lastRunAt < WEBSITE_SYNC_INTERVAL_MS) {
      return;
    }

    lastWebsiteSyncAttempt = now;
    await runFacebookNewsSync("facebook-to-system", source);
  } catch (error) {
    lastWebsiteSyncAttempt = now;
    console.error("Failed to sync Facebook posts for website:", error);
  }
}
