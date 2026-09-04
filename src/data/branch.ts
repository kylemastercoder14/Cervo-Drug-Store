/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BranchValidation } from "@/lib/validators";
import { z } from "zod";
import { toast } from "sonner";
import {
  createBranch,
  deleteBranch,
  getAllBranches,
  updateBranch,
} from "@/actions/branch";

export function useGetBranches() {
  return useQuery({
    queryFn: async () => getAllBranches(),
    queryKey: ["branches"],
  });
}

export function useSaveBranch(initialData?: any) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: z.infer<typeof BranchValidation>) => {
      if (initialData) {
        return updateBranch(values, initialData.id);
      } else {
        return createBranch(values);
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["branches"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (branchId: string) => {
      return deleteBranch(branchId);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["branches"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}
