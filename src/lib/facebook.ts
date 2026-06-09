const GRAPH_API_VERSION = "v25.0";
const POST_READ_FIELDS =
  "id,message,full_picture,permalink_url,created_time,attachments{type,url,target{id,url},media,subattachments{type,url,target{id,url},media}}";

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

type FacebookTokenCandidate = {
  token: string;
  source:
    | "FACEBOOK_PAGE_ACCESS_TOKEN"
    | "FACEBOOK_USER_ACCESS_TOKEN_PAGE"
    | "FACEBOOK_USER_ACCESS_TOKEN";
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
  video_source_url?: string;
  video_thumbnail_url?: string;
  attachments?: {
    data?: FacebookGraphAttachment[];
  };
};

type FacebookGraphAttachment = {
  type?: string;
  url?: string;
  media?: {
    source?: string;
    image?: {
      src?: string;
    };
  };
  target?: {
    id?: string;
    url?: string;
  };
  subattachments?: {
    data?: FacebookGraphAttachment[];
  };
};

type FacebookVideoDetails = {
  source?: string;
  picture?: string;
  permalink_url?: string;
};

const decodeHtmlEntities = (value: string) =>
  value.replace(
    /&(#(?:x[0-9a-f]+|\d+)|[a-z]+);/gi,
    (entity, code: string) => {
      const namedEntities: Record<string, string> = {
        amp: "&",
        apos: "'",
        gt: ">",
        lt: "<",
        nbsp: " ",
        quot: '"',
      };

      if (code.startsWith("#x") || code.startsWith("#X")) {
        const codePoint = Number.parseInt(code.slice(2), 16);
        return Number.isNaN(codePoint) || codePoint > 0x10ffff
          ? entity
          : String.fromCodePoint(codePoint);
      }

      if (code.startsWith("#")) {
        const codePoint = Number.parseInt(code.slice(1), 10);
        return Number.isNaN(codePoint) || codePoint > 0x10ffff
          ? entity
          : String.fromCodePoint(codePoint);
      }

      return namedEntities[code.toLowerCase()] ?? entity;
    },
  );

export const stripHtml = (value: string) =>
  decodeHtmlEntities(
    value
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|h[1-6]|blockquote)>/gi, "\n")
      .replace(/<li[^>]*>/gi, "\n- ")
      .replace(/<\/li>/gi, "")
      .replace(/<\/(ul|ol)>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n"),
  ).trim();

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

  if (
    message.includes("pages_read_engagement") ||
    message.includes("pages_read_user_content")
  ) {
    return "The Facebook token used by the server cannot read the Page feed. Generate a Page access token that includes pages_read_engagement and pages_read_user_content for this Page, then reload PM2 with the updated env.";
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

  const normalizedTitle = title.trim();
  const templateSections = [
    "Cervo Drug Store News & Events",
    normalizedTitle,
    plainContent,
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

async function resolveReadTokenCandidates(
  pageId: string,
): Promise<FacebookTokenCandidate[]> {
  const candidates: FacebookTokenCandidate[] = [];
  const seenTokens = new Set<string>();
  const pushCandidate = (candidate: FacebookTokenCandidate | null) => {
    if (!candidate?.token || seenTokens.has(candidate.token)) {
      return;
    }

    seenTokens.add(candidate.token);
    candidates.push(candidate);
  };

  const explicitPageToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
  if (explicitPageToken) {
    pushCandidate({
      token: explicitPageToken,
      source: "FACEBOOK_PAGE_ACCESS_TOKEN",
    });
  }

  const userToken = process.env.FACEBOOK_USER_ACCESS_TOKEN?.trim();
  if (!userToken) {
    if (candidates.length === 0) {
      throw new Error(
        "Missing Facebook access token. Set FACEBOOK_PAGE_ACCESS_TOKEN or FACEBOOK_USER_ACCESS_TOKEN in .env.",
      );
    }

    return candidates;
  }

  const accountsUrl = new URL(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/me/accounts`,
  );
  accountsUrl.searchParams.set("fields", "id,name,access_token");
  accountsUrl.searchParams.set("access_token", userToken);

  const accountsResponse = await readGraphJson<{ data?: GraphPageAccount[] }>(
    accountsUrl.toString(),
  );

  if (accountsResponse.ok) {
    const pageAccount = accountsResponse.data.data?.find(
      (account) => account.id === pageId,
    );

    if (pageAccount?.access_token) {
      pushCandidate({
        token: pageAccount.access_token,
        source: "FACEBOOK_USER_ACCESS_TOKEN_PAGE",
      });
    }
  }

  pushCandidate({
    token: userToken,
    source: "FACEBOOK_USER_ACCESS_TOKEN",
  });

  return candidates;
}

async function readWithFacebookToken<T>(
  pageId: string,
  run: (candidate: FacebookTokenCandidate) => Promise<T>,
): Promise<T> {
  const candidates = await resolveReadTokenCandidates(pageId);
  const errors: string[] = [];

  for (const candidate of candidates) {
    try {
      return await run(candidate);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown Facebook read error.";
      errors.push(`${candidate.source}: ${message}`);
    }
  }

  throw new Error(errors.join(" | "));
}

const findVideoAttachment = (
  attachments?: FacebookGraphAttachment[],
): FacebookGraphAttachment | undefined => {
  for (const attachment of attachments ?? []) {
    const type = attachment.type?.toLowerCase() || "";

    if (type.includes("video") || attachment.media?.source) {
      return attachment;
    }

    const nested = findVideoAttachment(attachment.subattachments?.data);
    if (nested) {
      return nested;
    }
  }

  return undefined;
};

async function fetchFacebookVideoDetails(
  videoId: string,
  accessToken: string,
) {
  const videoUrl = new URL(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${videoId}`,
  );
  videoUrl.searchParams.set("fields", "source,picture,permalink_url");
  videoUrl.searchParams.set("access_token", accessToken);

  const response = await readGraphJson<FacebookVideoDetails>(
    videoUrl.toString(),
  );

  if (!response.ok) {
    return null;
  }

  return response.data;
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
  return readWithFacebookToken(pageId, async ({ token }) => {
    const postUrl = new URL(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${postId}`,
    );
    postUrl.searchParams.set(
      "fields",
      POST_READ_FIELDS,
    );
    postUrl.searchParams.set("access_token", token);

    const response = await readGraphJson<FacebookGraphPost>(postUrl.toString());

    if (!response.ok) {
      throw new Error(
        normalizeFacebookError(response.data.error?.message) ||
          "Failed to fetch the Facebook post.",
      );
    }

    if (!response.data?.id) {
      return null;
    }

    const videoAttachment = findVideoAttachment(response.data.attachments?.data);
    const videoDetails = videoAttachment?.target?.id
      ? await fetchFacebookVideoDetails(videoAttachment.target.id, token)
      : null;

    return {
      ...response.data,
      video_source_url:
        videoAttachment?.media?.source || videoDetails?.source || undefined,
      video_thumbnail_url:
        videoAttachment?.media?.image?.src ||
        videoDetails?.picture ||
        response.data.full_picture ||
        undefined,
    };
  });
}

export async function fetchFacebookPageFeed(pageId: string, limit = 25) {
  return readWithFacebookToken(pageId, async ({ token }) => {
    const feedUrl = new URL(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/feed`,
    );
    feedUrl.searchParams.set(
      "fields",
      POST_READ_FIELDS,
    );
    feedUrl.searchParams.set("limit", String(limit));
    feedUrl.searchParams.set("access_token", token);

    const response = await readGraphJson<{ data?: FacebookGraphPost[] }>(
      feedUrl.toString(),
    );

    if (!response.ok) {
      throw new Error(
        normalizeFacebookError(response.data.error?.message) ||
          "Failed to fetch Facebook page posts.",
      );
    }

    const posts = response.data.data ?? [];

    return Promise.all(
      posts.map(async (post) => {
        const videoAttachment = findVideoAttachment(post.attachments?.data);
        const videoDetails = videoAttachment?.target?.id
          ? await fetchFacebookVideoDetails(videoAttachment.target.id, token)
          : null;

        return {
          ...post,
          video_source_url:
            videoAttachment?.media?.source || videoDetails?.source || undefined,
          video_thumbnail_url:
            videoAttachment?.media?.image?.src ||
            videoDetails?.picture ||
            post.full_picture ||
            undefined,
        };
      }),
    );
  });
}
