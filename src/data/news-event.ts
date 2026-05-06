/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createNewsEvent,
  deleteNewsEvent,
  getAllNewsEvents,
  updateNewsEvent,
} from "@/actions/news-events";
import { NewsEventValidation } from "@/lib/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

const publishNewsEventToFacebook = async (payload: {
  title: string;
  content: string;
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
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["news-and-events"] });

        if (!initialData && data.data) {
          const publishToastId = toast.loading("Publishing post to Facebook...");

          try {
            await publishNewsEventToFacebook({
              title: data.data.title,
              content: data.data.content,
              image: data.data.image,
            });

            toast.dismiss(publishToastId);
            toast.success("News/event was also published to Facebook.");
          } catch (error: any) {
            toast.dismiss(publishToastId);
            toast.error(
              error.message ||
                "News/event was created, but Facebook publishing failed."
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
