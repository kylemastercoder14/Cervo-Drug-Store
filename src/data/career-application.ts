/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  deleteApplication,
  getAllApplications,
  updateApplicationStatus,
} from "@/actions/career";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetApplications() {
  return useQuery({
    queryFn: async () => getAllApplications(),
    queryKey: ["career-applications"],
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      status,
      remarks
    }: {
      applicationId: string;
      status: string;
      remarks?: string;
    }) => {
      return updateApplicationStatus(applicationId, status, remarks);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["career-applications"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationId: string) => {
      return deleteApplication(applicationId);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["career-applications"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}

