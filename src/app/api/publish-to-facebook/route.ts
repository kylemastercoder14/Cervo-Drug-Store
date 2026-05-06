import { NextRequest, NextResponse } from "next/server";

const GRAPH_API_VERSION = "v25.0";

type GraphErrorPayload = {
  error?: {
    message?: string;
    type?: string;
    code?: number;
    error_subcode?: number;
  };
};

type GraphPageAccount = {
  id: string;
  name: string;
  access_token?: string;
};

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

async function readGraphJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  const data = (await response.json()) as T & GraphErrorPayload;

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

async function resolvePageAccessToken(pageId: string) {
  const explicitPageToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
  if (explicitPageToken) {
    return explicitPageToken;
  }

  const userToken = process.env.FACEBOOK_USER_ACCESS_TOKEN?.trim();
  if (!userToken) {
    throw new Error(
      "Missing Facebook access token. Set FACEBOOK_PAGE_ACCESS_TOKEN or FACEBOOK_USER_ACCESS_TOKEN in .env.",
    );
  }

  const accountsUrl = new URL(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/me/accounts`,
  );
  accountsUrl.searchParams.set("fields", "id,name,access_token");
  accountsUrl.searchParams.set("access_token", userToken);

  const accountsResponse = await readGraphJson<{ data?: GraphPageAccount[] }>(
    accountsUrl.toString(),
  );

  if (!accountsResponse.ok) {
    throw new Error(
      accountsResponse.data.error?.message ||
        "Unable to load Facebook page accounts for this token.",
    );
  }

  const pageAccount = accountsResponse.data.data?.find(
    (account) => account.id === pageId,
  );

  if (!pageAccount?.access_token) {
    throw new Error(
      "The configured Facebook token does not manage the selected page. Make sure the account has a Page role and that the token includes pages_show_list and pages_manage_posts.",
    );
  }

  return pageAccount.access_token;
}

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

  const { title, content, link, image, imageUrls } = await req.json();

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json(
      { error: "Title and content are required." },
      { status: 400 },
    );
  }

  try {
    const accessToken = await resolvePageAccessToken(pageId);
    const plainContent = stripHtml(content);
    const messagePreview =
      plainContent.length > 300
        ? `${plainContent.slice(0, 300).trim()}...`
        : plainContent;
    const message = `${title.trim()}\n\n${messagePreview}`;
    const normalizedImageUrls = [
      ...(Array.isArray(imageUrls)
      ? imageUrls
          .map((value) => String(value).trim())
          .filter(Boolean)
      : []),
      ...(image ? [String(image).trim()] : []),
    ].filter(Boolean);

    let publishedId: string | undefined;
    let mediaId: string | undefined;
    let mode: "feed" | "photo" | "multi-photo" = "feed";

    if (normalizedImageUrls.length > 0) {
      const uploadedMediaIds: string[] = [];

      for (const imageUrl of normalizedImageUrls) {
        const photoBody = new URLSearchParams({
          access_token: accessToken,
          url: imageUrl,
          published: "false",
        });

        const photoUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/photos`;
        const photoResponse = await readGraphJson<{ id?: string }>(photoUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: photoBody.toString(),
        });

        if (!photoResponse.ok || !photoResponse.data.id) {
          return NextResponse.json(
            {
              error:
                photoResponse.data.error?.message ||
                "Failed to upload one of the Facebook images.",
            },
            { status: 500 },
          );
        }

        uploadedMediaIds.push(photoResponse.data.id);
      }

      const feedBody = new URLSearchParams({
        access_token: accessToken,
        message,
      });

      uploadedMediaIds.forEach((id, index) => {
        feedBody.set(`attached_media[${index}]`, JSON.stringify({ media_fbid: id }));
      });

      const feedUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/feed`;
      const feedResponse = await readGraphJson<{ id?: string }>(feedUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: feedBody.toString(),
      });

      publishedId = feedResponse.data.id;
      mediaId = uploadedMediaIds[0];
      mode = uploadedMediaIds.length > 1 ? "multi-photo" : "photo";

      if (!feedResponse.ok || !publishedId) {
        return NextResponse.json(
          {
            error:
              feedResponse.data.error?.message ||
              "Failed to publish Facebook image post.",
          },
          { status: 500 },
        );
      }
    } else {
      const body = new URLSearchParams({
        access_token: accessToken,
        message,
      });

      if (link?.trim()) {
        body.set("link", link.trim());
      }

      const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/feed`;
      const response = await readGraphJson<{ id?: string }>(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      publishedId = response.data.id;

      if (!response.ok || !publishedId) {
        return NextResponse.json(
          {
            error:
              response.data.error?.message ||
              "Failed to publish to Facebook.",
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      postId: publishedId,
      mediaId,
      mode,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          (error as { message?: string })?.message ||
          "Unexpected Facebook publishing error.",
      },
      { status: 500 },
    );
  }
}
