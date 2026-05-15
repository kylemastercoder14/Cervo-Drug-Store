/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createNewsEvent,
  deleteNewsEvent,
  getAllNewsEvents,
  syncFacebookPostsToNews,
  syncNewsEventUpdateToFacebook,
  updateNewsEvent,
} from "@/actions/news-events";
import { NewsEventValidation } from "@/lib/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export const publishNewsEventToFacebook = async (payload: {
  newsId?: string;
  title: string;
  content: string;
  link?: string;
  image?: string;
}) => {
  const response = await fetch("/api/publish-to-facebook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as {
    error?: string;
    success?: boolean;
  };

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to publish to Facebook.");
  }

  return data;
};

export function useGetNewsEvent() {
  return useQuery({
    queryFn: async () => getAllNewsEvents(),
    queryKey: ["news-and-events"],
  });
}

export function useSaveNewsEvent(initialData?: any) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: z.infer<typeof NewsEventValidation>) => {
      if (initialData) {
        return updateNewsEvent(values, initialData.id);
      } else {
        return createNewsEvent(values);
      }
    },
    onSuccess: async (data, values) => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["news-and-events"] });

        if (!initialData && data.data) {
          const publishToastId = toast.loading("Publishing post to Facebook...");
          const facebookLink =
            typeof window !== "undefined"
              ? `${window.location.origin}/#blogs`
              : undefined;

          try {
            await publishNewsEventToFacebook({
              newsId: data.data.id,
              title: data.data.title,
              content: data.data.content,
              link: facebookLink,
              image: data.data.image,
            });

            toast.dismiss(publishToastId);
            toast.success("News/event was also published to Facebook.");
            queryClient.invalidateQueries({ queryKey: ["news-and-events"] });
          } catch (error: any) {
            toast.dismiss(publishToastId);
            toast.error(
              error.message ||
                "News/event was created, but Facebook publishing failed."
            );
          }
        }

        if (initialData?.id && initialData?.facebookPostId) {
          const syncToastId = toast.loading("Syncing update to Facebook...");

          try {
            const syncResult = await syncNewsEventUpdateToFacebook(
              initialData.id,
              values
            );

            if (syncResult?.error) {
              throw new Error(syncResult.error);
            }

            toast.dismiss(syncToastId);
            toast.success("News/event update was also synced to Facebook.");
            queryClient.invalidateQueries({ queryKey: ["news-and-events"] });
          } catch (error: any) {
            toast.dismiss(syncToastId);
            toast.error(
              error.message ||
                "News/event was updated, but Facebook sync failed."
            );
          }
        }
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}

export function useSyncFacebookPostsToNews(options?: { silent?: boolean }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => syncFacebookPostsToNews(),
    onSuccess: (data) => {
      if (data?.success && !options?.silent) {
        toast.success(data.success);
      }

      queryClient.invalidateQueries({ queryKey: ["news-and-events"] });
    },
    onError: (error: any) => {
      if (!options?.silent) {
        toast.error(error.message || "An error occurred");
      }
    },
  });
}

export function useDeleteNewsEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newsId: string) => {
      return deleteNewsEvent(newsId);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["news-and-events"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}
