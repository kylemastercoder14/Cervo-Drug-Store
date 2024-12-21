
import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import { getAllLogs } from "@/actions/logs";
import LogClient from "./_components/client";

const AdminLogs = async () => {
  const queryClient = new QueryClient();

  // Prefetch the data from the server
  await queryClient.prefetchQuery({
    queryKey: ["logs"],
    queryFn: getAllLogs,
  });

  // Hydrate the query data for the client
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="grid py-5 items-start gap-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Manage Logs"
          description="View, add, and manage the banners displayed across your platform. Easily update existing banners or create new ones to keep your site fresh and engaging."
        />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <LogClient />
      </HydrationBoundary>
    </div>
  );
};

export default AdminLogs;
