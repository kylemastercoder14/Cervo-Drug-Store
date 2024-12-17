import { getAllCustomers } from "@/actions/customers";
import { useQuery } from "@tanstack/react-query";

export function useGetCustomers() {
  return useQuery({
    queryFn: async () => getAllCustomers(),
    queryKey: ["customers"],
  });
}
