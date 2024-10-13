/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "@/actions/product";
import { ProductValidation } from "@/lib/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export function useGetProducts() {
  return useQuery({
    queryFn: async () => getAllProducts(),
    queryKey: ["products"],
  });
}

export function useSaveProduct(initialData?: any) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: z.infer<typeof ProductValidation>) => {
      if (initialData) {
        return updateProduct(values, initialData.id);
      } else {
        return createProduct(values);
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["products"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      return deleteProduct(productId);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["products"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}
