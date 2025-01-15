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
import { getAllOrders } from "../actions/order";

export function useGetOrders() {
  return useQuery({
    queryFn: async () => getAllOrders(),
    queryKey: ["orders"],
  });
}

// export function useDeleteNewsEvent() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (newsId: string) => {
//       return deleteNewsEvent(newsId);
//     },
//     onSuccess: (data) => {
//       if (data?.success) {
//         toast.success(data.success);
//         queryClient.invalidateQueries({ queryKey: ["news-and-events"] });
//       }
//     },
//     onError: (error: any) => {
//       toast.error(error.message || "An error occurred");
//     },
//   });
// }
