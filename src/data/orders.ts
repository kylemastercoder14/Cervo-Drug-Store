import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteOrder, getAllOrders } from "../actions/order";

export function useGetOrders() {
  return useQuery({
    queryFn: async () => getAllOrders(),
    queryKey: ["orders"],
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      return deleteOrder(orderId);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred");
    },
  });
}
