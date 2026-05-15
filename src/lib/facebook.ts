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

export type FacebookPostPayload = {
  newsId?: string;
  title: string;
  content: string;
  link?: string;
  image?: string;
  imageUrls?: string[];
};

export type FacebookPublishResult = {
  success: true;
  postId: string;
  mediaId?: string;
  mode: "feed" | "photo" | "multi-photo";
  permalinkUrl?: string;
};

export type FacebookUpdateResult = {
  success: true;
  postId: string;
  permalinkUrl?: string;
};

export type FacebookGraphPost = {
  id: string;
  message?: string;
  full_picture?: string;
  permalink_url?: string;
  created_time?: string;
};

export const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const normalizeFacebookError = (message?: string) => {
  if (!message) {
    return "Unexpected Facebook publishing error.";
  }

  if (message.includes("Application has been deleted")) {
    return "The configured Facebook access token belongs to a deleted or disabled Meta app. Generate a new Page access token from an active Meta app, then update FACEBOOK_PAGE_ACCESS_TOKEN in .env.";
  }

  if (message.includes("Error validating access token")) {
    return "The configured Facebook access token is invalid or expired. Generate a new token and update your Facebook env settings.";
  }

  return message;
};

export const buildFacebookPostMessage = ({
  title,
  content,
  link,
}: {
  title: string;
  content: string;
  link?: string;
}) => {
  const plainContent = stripHtml(content);
  const messagePreview =
    plainContent.length > 300
      ? `${plainContent.slice(0, 300).trim()}...`
      : plainContent;

  const normalizedTitle = title.trim();
  const templateSections = [
    "Cervo Drug Store News & Events",
    normalizedTitle,
    messagePreview,
    link?.trim() ? `Read more: ${link.trim()}` : null,
    "#CervoDrugStore #NewsAndEvents",
  ].filter(Boolean);

  return templateSections.join("\n\n");
};

export async function readGraphJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  const data = (await response.json()) as T & GraphErrorPayload;

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export async function resolvePageAccessToken(pageId: string) {
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
      normalizeFacebookError(accountsResponse.data.error?.message) ||
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

export async function fetchFacebookPermalink(
  postId: string,
  accessToken: string,
) {
  const detailsUrl = new URL(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${postId}`,
  );
  detailsUrl.searchParams.set("fields", "permalink_url");
  detailsUrl.searchParams.set("access_token", accessToken);

  const detailsResponse = await readGraphJson<{ permalink_url?: string }>(
    detailsUrl.toString(),
  );

  if (!detailsResponse.ok) {
    return undefined;
  }

  return detailsResponse.data.permalink_url;
}

export async function publishFacebookPageNews(
  pageId: string,
  payload: FacebookPostPayload,
): Promise<FacebookPublishResult> {
  const accessToken = await resolvePageAccessToken(pageId);
  const message = buildFacebookPostMessage(payload);
  const normalizedImageUrls = [
    ...(Array.isArray(payload.imageUrls)
      ? payload.imageUrls
          .map((value) => String(value).trim())
          .filter(Boolean)
      : []),
    ...(payload.image ? [String(payload.image).trim()] : []),
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
        throw new Error(
          normalizeFacebookError(photoResponse.data.error?.message) ||
            "Failed to upload one of the Facebook images.",
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
      throw new Error(
        normalizeFacebookError(feedResponse.data.error?.message) ||
          "Failed to publish Facebook image post.",
      );
    }
  } else {
    const body = new URLSearchParams({
      access_token: accessToken,
      message,
    });

    if (payload.link?.trim()) {
      body.set("link", payload.link.trim());
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
      throw new Error(
        normalizeFacebookError(response.data.error?.message) ||
          "Failed to publish to Facebook.",
      );
    }
  }

  const permalinkUrl = await fetchFacebookPermalink(publishedId, accessToken);

  return {
    success: true,
    postId: publishedId,
    mediaId,
    mode,
    permalinkUrl,
  };
}

export async function updateFacebookPageNews(
  pageId: string,
  postId: string,
  payload: Pick<FacebookPostPayload, "title" | "content" | "link">,
): Promise<FacebookUpdateResult> {
  const accessToken = await resolvePageAccessToken(pageId);
  const message = buildFacebookPostMessage(payload);

  const body = new URLSearchParams({
    access_token: accessToken,
    message,
  });

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${postId}`;
  const response = await readGraphJson<{ success?: boolean }>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok || response.data.success !== true) {
    throw new Error(
      normalizeFacebookError(response.data.error?.message) ||
        "Failed to update Facebook post.",
    );
  }

  const permalinkUrl = await fetchFacebookPermalink(postId, accessToken);

  return {
    success: true,
    postId,
    permalinkUrl,
  };
}

export async function fetchFacebookPost(
  pageId: string,
  postId: string,
): Promise<FacebookGraphPost | null> {
  const accessToken = await resolvePageAccessToken(pageId);
  const postUrl = new URL(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${postId}`,
  );
  postUrl.searchParams.set(
    "fields",
    "id,message,full_picture,permalink_url,created_time",
  );
  postUrl.searchParams.set("access_token", accessToken);

  const response = await readGraphJson<FacebookGraphPost>(postUrl.toString());

  if (!response.ok) {
    throw new Error(
      normalizeFacebookError(response.data.error?.message) ||
        "Failed to fetch the Facebook post.",
    );
  }

  return response.data?.id ? response.data : null;
}

export async function fetchFacebookPageFeed(pageId: string, limit = 25) {
  const accessToken = await resolvePageAccessToken(pageId);
  const feedUrl = new URL(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/feed`,
  );
  feedUrl.searchParams.set(
    "fields",
    "id,message,full_picture,permalink_url,created_time",
  );
  feedUrl.searchParams.set("limit", String(limit));
  feedUrl.searchParams.set("access_token", accessToken);

  const response = await readGraphJson<{ data?: FacebookGraphPost[] }>(
    feedUrl.toString(),
  );

  if (!response.ok) {
    throw new Error(
      normalizeFacebookError(response.data.error?.message) ||
        "Failed to fetch Facebook page posts.",
    );
  }

  return response.data.data ?? [];
}
