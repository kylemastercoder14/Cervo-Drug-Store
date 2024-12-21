import { getAllLogs } from "@/actions/logs";
import { useQuery } from "@tanstack/react-query";

export function useGetLogs() {
  return useQuery({
    queryFn: async () => getAllLogs(),
    queryKey: ["logs"],
  });
}
