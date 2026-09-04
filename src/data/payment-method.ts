/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createPaymentMethod,
  deletePaymentMethod,
  getAllPaymentMethods,
  updatePaymentMethod,
} from "@/actions/payment-method";
import { PaymentMethodValidation } from "@/lib/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export function useGetPaymentMethods() {
  return useQuery({
    queryFn: async () => getAllPaymentMethods(),
    queryKey: ["payment-methods"],
  });
}

export function useSavePaymentMethod(initialData?: any) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: z.infer<typeof PaymentMethodValidation>) => {
      if (initialData) {
        return updatePaymentMethod(values, initialData.id);
      }

      return createPaymentMethod(values);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
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

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentMethodId: string) => {
      return deletePaymentMethod(paymentMethodId);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
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
