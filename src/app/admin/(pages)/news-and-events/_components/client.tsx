"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import Image from "next/image";
import {
  ArrowUpDown,
  CheckCircle2,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock3,
  Film,
  Newspaper,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  TriangleAlert,
} from "lucide-react";
import { useGetNewsEvent } from "@/data/news-event";
import { NewsEventColumn } from "./column";
import { CellAction } from "./cell-action";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const RECENT_DAYS = 30;
const PREVIEW_LIMIT = 260;

type SyncStatus = {
  ok: boolean;
  mode: "both" | "facebook-to-system" | "system-to-facebook";
  source: string;
  publishedToFacebookCount: number;
  importedFromFacebookCount: number;
  publishErrors: string[];
  importErrors?: string[];
  ranAt: string;
  message: string;
} | null;

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const NewsEventClient = ({ syncStatus }: { syncStatus: SyncStatus }) => {
  const { data: newsEventData, error, isLoading } = useGetNewsEvent();
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: NewsEventColumn[] = useMemo(
    () =>
      newsEventData?.data?.map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        image: item.image,
        videoUrl: item.videoUrl,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
        createdAtRaw: new Date(item.createdAt).toISOString(),
        facebookPostId: item.facebookPostId,
        facebookPermalink: item.facebookPermalink,
        facebookPublishedAt: item.facebookPublishedAt
          ? new Date(item.facebookPublishedAt).toISOString()
          : null,
      })) || [],
    [newsEventData]
  );

  const filteredAndSortedData = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    const recentThreshold = new Date();
    recentThreshold.setDate(recentThreshold.getDate() - RECENT_DAYS);

    const filtered = formattedData.filter((item) => {
      const plainContent = stripHtml(item.content).toLowerCase();
      const itemDate = new Date(item.createdAtRaw);

      if (filterBy === "this-month") {
        const now = new Date();
        if (
          itemDate.getMonth() !== now.getMonth() ||
          itemDate.getFullYear() !== now.getFullYear()
        ) {
          return false;
        }
      }

      if (filterBy === "recent") {
        if (itemDate < recentThreshold) {
          return false;
        }
      }

      if (filterBy === "has-image" && !item.image) {
        return false;
      }

      if (filterBy === "has-video" && !item.videoUrl) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        item.title.toLowerCase().includes(normalizedQuery) ||
        plainContent.includes(normalizedQuery) ||
        item.createdAt.toLowerCase().includes(normalizedQuery)
      );
    });

    return filtered.sort((a, b) => {
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }

      const dateA = new Date(a.createdAtRaw).getTime();
      const dateB = new Date(b.createdAtRaw).getTime();

      if (sortBy === "oldest") {
        return dateA - dateB;
      }

      return dateB - dateA;
    });
  }, [filterBy, formattedData, searchTerm, sortBy]);

  const latestNewsId = filteredAndSortedData[0]?.id;

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id]
    );
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={[
                "rounded-full p-2",
                syncStatus?.ok
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700",
              ].join(" ")}
            >
              {syncStatus?.ok ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <TriangleAlert className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Last Facebook Sync Status
              </p>
              <p className="text-sm text-muted-foreground">
                {syncStatus?.message || "No sync run has been recorded yet."}
              </p>
              {syncStatus?.importErrors?.length ? (
                <p className="mt-1 max-w-3xl text-xs text-red-600">
                  {syncStatus.importErrors[0]}
                </p>
              ) : null}
              {syncStatus?.publishErrors?.length ? (
                <p className="mt-1 max-w-3xl text-xs text-red-600">
                  {syncStatus.publishErrors[0]}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" className="gap-1 rounded-full px-3 py-1">
              <Clock3 className="h-3.5 w-3.5" />
              {syncStatus?.ranAt
                ? format(new Date(syncStatus.ranAt), "MMM d, yyyy h:mm a")
                : "No timestamp"}
            </Badge>
            <Badge variant="outline" className="gap-1 rounded-full px-3 py-1">
              <RefreshCw className="h-3.5 w-3.5" />
              {syncStatus?.mode || "No mode"}
            </Badge>
            <Badge variant="outline" className="gap-1 rounded-full px-3 py-1">
              <RefreshCw className="h-3.5 w-3.5" />
              {syncStatus
                ? `Imported ${syncStatus.importedFromFacebookCount}`
                : "Imported 0"}
            </Badge>
            <Badge variant="outline" className="gap-1 rounded-full px-3 py-1">
              <Newspaper className="h-3.5 w-3.5" />
              {syncStatus
                ? `Published ${syncStatus.publishedToFacebookCount}`
                : "Published 0"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-2 rounded-full px-3 py-1 text-xs">
            <Newspaper className="h-3.5 w-3.5" />
            {formattedData.length} total posts
          </Badge>
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
            Card view
          </Badge>
        </div>

        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">

          <div className="relative w-full md:w-[320px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title or content"
              className="pl-9"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="title-asc">Title A-Z</SelectItem>
              <SelectItem value="title-desc">Title Z-A</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter posts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All posts</SelectItem>
              <SelectItem value="recent">Last 30 days</SelectItem>
              <SelectItem value="this-month">This month</SelectItem>
              <SelectItem value="has-image">Has image</SelectItem>
              <SelectItem value="has-video">Has video</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="gap-0 overflow-hidden rounded-2xl py-0">
              <Skeleton className="h-52 w-full rounded-none" />
              <div className="space-y-4 p-6">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredAndSortedData.length === 0 ? (
        <Card className="rounded-2xl py-0">
          <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <Newspaper className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No news or events found
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Try adjusting your search or add a new post to keep this section fresh.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredAndSortedData.map((item, index) => {
            const plainContent = stripHtml(item.content);
            const isExpanded = expandedIds.includes(item.id);
            const isLatest = item.id === latestNewsId;
            const itemDate = new Date(item.createdAtRaw);
            const recentThreshold = new Date();
            recentThreshold.setDate(recentThreshold.getDate() - RECENT_DAYS);
            const isRecent = itemDate >= recentThreshold;
            const shouldClamp = plainContent.length > PREVIEW_LIMIT;

            return (
            <Card
              key={item.id}
              className={[
                "overflow-hidden rounded-2xl border-zinc-200 py-0 transition-shadow hover:shadow-md",
                isLatest
                  ? "border-[#437634] shadow-md xl:col-span-2"
                  : "bg-white",
              ].join(" ")}
            >
              <div className="relative h-60 w-full overflow-hidden bg-zinc-100">
                {item.videoUrl ? (
                  <video
                    src={item.videoUrl}
                    poster={item.image}
                    controls
                    preload="metadata"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className={[
                      "object-contain",
                      isLatest ? "scale-[1.02]" : "",
                    ].join(" ")}
                  />
                )}
                <div
                  className={[
                    "pointer-events-none absolute inset-0",
                    isLatest
                      ? "bg-gradient-to-t from-[#1f3d18]/80 via-[#1f3d18]/10 to-transparent"
                      : "bg-gradient-to-t from-black/35 to-transparent",
                  ].join(" ")}
                />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {isLatest && (
                    <Badge className="rounded-full bg-[#437634] px-3 py-1 text-white hover:bg-[#437634]">
                      <Star className="mr-1 h-3.5 w-3.5" />
                      Latest post
                    </Badge>
                  )}
                  {item.videoUrl && (
                    <Badge className="rounded-full bg-slate-950/80 px-3 py-1 text-white hover:bg-slate-950/80">
                      <Film className="mr-1 h-3.5 w-3.5" />
                      Video
                    </Badge>
                  )}
                  {isRecent && !isLatest && (
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-white/90 px-3 py-1 text-slate-900"
                    >
                      Recent
                    </Badge>
                  )}
                  {index < 3 && !isLatest && (
                    <Badge
                      variant="outline"
                      className="rounded-full border-white/70 bg-black/20 px-3 py-1 text-white"
                    >
                      Featured
                    </Badge>
                  )}
                </div>
              </div>

              <CardHeader className="gap-2 p-5 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1.5">
                    <Badge variant="outline" className="w-fit rounded-full px-3 py-1 text-xs">
                      <CalendarDays className="mr-1 h-3.5 w-3.5" />
                      {item.createdAt}
                    </Badge>
                    <CardTitle className="line-clamp-2 text-lg leading-snug">
                      {item.title}
                    </CardTitle>
                  </div>
                  <CardAction className="mt-0">
                    <CellAction data={item} />
                  </CardAction>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 p-5 pt-0">
                {isExpanded ? (
                  <div
                    className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-slate-900 prose-p:text-muted-foreground prose-li:text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                ) : (
                  <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
                    {shouldClamp
                      ? `${plainContent.slice(0, PREVIEW_LIMIT).trim()}...`
                      : plainContent}
                  </p>
                )}

                {shouldClamp && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-auto px-0 text-sm font-medium text-[#437634] hover:bg-transparent hover:text-[#2f5524]"
                    onClick={() => toggleExpanded(item.id)}
                  >
                    {isExpanded ? (
                      <>
                        Show less <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Read more <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}

                <div className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
                  <span>
                    {item.facebookPostId ? "Synced to Facebook" : "Not yet posted to Facebook"}
                  </span>
                  <span>ID: {item.id.slice(0, 8)}</span>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NewsEventClient;
