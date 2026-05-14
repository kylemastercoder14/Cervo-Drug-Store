import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/db";
import {
  normalizeFacebookError,
  publishFacebookPageNews,
} from "@/lib/facebook";

export async function POST(req: NextRequest) {
  const pageId = process.env.FACEBOOK_PAGE_ID?.trim();

  if (!pageId) {
    return NextResponse.json(
      {
        error:
          "Missing FACEBOOK_PAGE_ID in .env. Configure the Facebook page you want to publish to.",
      },
      { status: 500 },
    );
  }

  const { newsId, title, content, link, image, imageUrls } = await req.json();

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json(
      { error: "Title and content are required." },
      { status: 400 },
    );
  }

  try {
    const result = await publishFacebookPageNews(pageId, {
      newsId,
      title,
      content,
      link,
      image,
      imageUrls,
    });

    if (newsId?.trim()) {
      await db.news.update({
        where: {
          id: newsId.trim(),
        },
        data: {
          facebookPostId: result.postId,
          facebookPermalink: result.permalinkUrl || null,
          facebookPublishedAt: new Date(),
          facebookSyncSource: "APP_PUBLISH",
          lastFacebookSyncAt: new Date(),
        },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          normalizeFacebookError((error as { message?: string })?.message) ||
          "Unexpected Facebook publishing error.",
      },
      { status: 500 },
    );
  }
}
