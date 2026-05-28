import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { fetchFacebookPost } from "@/lib/facebook";
import { syncFacebookPostToNews } from "@/lib/facebook-news";
import { recordFacebookSyncStatus } from "@/lib/facebook-sync";

type FacebookWebhookBody = {
  entry?: Array<{
    id?: string;
    changes?: Array<{
      field?: string;
      value?: {
        item?: string;
        verb?: string;
        post_id?: string;
        parent_id?: string;
      };
    }>;
  }>;
};

const verifySignature = (rawBody: string, signatureHeader: string | null) => {
  const appSecret = process.env.FACEBOOK_APP_SECRET?.trim();

  if (!appSecret || !signatureHeader?.startsWith("sha256=")) {
    return true;
  }

  const expected = crypto
    .createHmac("sha256", appSecret)
    .update(rawBody)
    .digest("hex");
  const received = signatureHeader.replace("sha256=", "");

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(received, "hex");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
};

export async function GET(req: NextRequest) {
  const verifyToken = process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN?.trim();
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    verifyToken &&
    token === verifyToken &&
    challenge
  ) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Webhook verification failed." }, { status: 403 });
}

export async function POST(req: NextRequest) {
  const pageId = process.env.FACEBOOK_PAGE_ID?.trim();

  if (!pageId) {
    return NextResponse.json(
      { error: "Missing FACEBOOK_PAGE_ID in .env." },
      { status: 500 },
    );
  }

  const rawBody = await req.text();
  const signatureHeader = req.headers.get("x-hub-signature-256");

  if (!verifySignature(rawBody, signatureHeader)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as FacebookWebhookBody;
  const errors: string[] = [];
  let importedFromFacebookCount = 0;

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const postId = change.value?.post_id || change.value?.parent_id;
      const isFeedChange = change.field === "feed";
      const isSupportedVerb = ["add", "edit"].includes(change.value?.verb ?? "");

      if (!isFeedChange || !isSupportedVerb || !postId) {
        continue;
      }

      try {
        const post = await fetchFacebookPost(pageId, postId);

        if (post?.id) {
          await syncFacebookPostToNews(post, "FACEBOOK_WEBHOOK");
          importedFromFacebookCount += 1;
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unknown Facebook webhook import error.";
        errors.push(`${postId}: ${message}`);
        console.error("Failed to sync Facebook webhook post:", error);
      }
    }
  }

  if (importedFromFacebookCount > 0 || errors.length > 0) {
    await recordFacebookSyncStatus({
      ok: errors.length === 0,
      mode: "facebook-to-system",
      source: "facebook:webhook",
      publishedToFacebookCount: 0,
      importedFromFacebookCount,
      publishErrors: [],
      importErrors: errors,
      ranAt: new Date().toISOString(),
      message:
        errors.length === 0
          ? "Facebook webhook sync completed successfully."
          : "Facebook webhook sync completed with errors.",
    });
  }

  return NextResponse.json({ success: true });
}
