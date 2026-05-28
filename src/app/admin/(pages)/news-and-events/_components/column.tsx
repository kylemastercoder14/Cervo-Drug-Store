"use client";

export type NewsEventColumn = {
  id: string;
  title: string;
  content: string;
  image: string;
  videoUrl?: string | null;
  createdAt: string;
  createdAtRaw: string;
  facebookPostId?: string | null;
  facebookPermalink?: string | null;
  facebookPublishedAt?: string | null;
};
