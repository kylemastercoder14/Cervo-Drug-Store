/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createInventory,
  deleteInventory,
  getAllInventory,
  updateInventory,
} from "@/actions/inventory";
import { InventoryValidation } from "@/lib/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export function useGetInventory() {
  return useQuery({
    queryFn: async () => getAllInventory(),
    queryKey: ["inventory"],
  });
}

export function useSaveInventory(initialData?: any) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: z.infer<typeof InventoryValidation>) => {
      if (initialData) {
        return updateInventory(values, initialData.id);
      } else {
        return createInventory(values);
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["inventory"] });
      } else {
        toast.error(data.error || "An error occurred");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}

export function useDeleteInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inventoryId: string) => {
      return deleteInventory(inventoryId);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["inventory"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}
