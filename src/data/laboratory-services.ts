/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createLaboratoryServiceCategory,
  deleteLaboratoryServiceCategory,
  getAllLaboratoryServiceCategories,
  updateLaboratoryServiceCategory,
} from "@/actions/laboratory-services";
import { LaboratoryServiceValidation } from "@/lib/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export function useGetLaboratoryServiceCategories() {
  return useQuery({
    queryFn: async () => getAllLaboratoryServiceCategories(),
    queryKey: ["laboratory-services"],
  });
}

export function useSaveLaboratoryServiceCategory(initialData?: any) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: z.infer<typeof LaboratoryServiceValidation>) => {
      if (initialData) {
        return updateLaboratoryServiceCategory(values, initialData.id);
      }

      return createLaboratoryServiceCategory(values);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["laboratory-services"] });
      }

      if (data.error) {
        toast.error(data.error);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}

export function useDeleteLaboratoryServiceCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      return deleteLaboratoryServiceCategory(categoryId);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["laboratory-services"] });
      }

      if (data?.error) {
        toast.error(data.error);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}
