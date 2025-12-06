import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import { getAllApplications } from "@/actions/career";
import ApplicationClient from "./_components/client";

const AdminCareerApplications = async () => {
  const queryClient = new QueryClient();

  // Prefetch the data from the server
  await queryClient.prefetchQuery({
    queryKey: ["career-applications"],
    queryFn: getAllApplications,
  });

  // Hydrate the query data for the client
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="grid py-5 items-start gap-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Career Applications"
          description="Manage and review job applications."
        />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <ApplicationClient />
      </HydrationBoundary>
    </div>
  );
};

export default AdminCareerApplications;

