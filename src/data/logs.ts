/* eslint-disable @typescript-eslint/no-explicit-any */

import { deleteLog, getAllLogs } from "@/actions/logs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetLogs() {
  return useQuery({
    queryFn: async () => getAllLogs(),
    queryKey: ["logs"],
  });
}

export function useDeleteLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logId: string) => {
      return deleteLog(logId);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["logs"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}
