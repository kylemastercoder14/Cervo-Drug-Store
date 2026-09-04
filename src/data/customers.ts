/* eslint-disable @typescript-eslint/no-explicit-any */

import { deleteCustomer, getAllCustomers } from "@/actions/customers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetCustomers() {
  return useQuery({
    queryFn: async () => getAllCustomers(),
    queryKey: ["customers"],
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerId: string) => {
      return deleteCustomer(customerId);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["customers"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}
