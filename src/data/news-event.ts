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
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["news-and-events"] });
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
