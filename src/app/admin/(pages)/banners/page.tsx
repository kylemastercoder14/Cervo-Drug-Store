
import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import BannerClient from "./_components/client";
import { getAllBanner } from "@/actions/banner";
import AddBanner from "./_components/add-banner";

const AdminBanner = async () => {
  const queryClient = new QueryClient();

  // Prefetch the data from the server
  await queryClient.prefetchQuery({
    queryKey: ["banners"],
    queryFn: getAllBanner,
  });

  // Hydrate the query data for the client
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="grid py-5 items-start gap-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Manage Banners"
          description="Manage the banners displayed across your platform to keep it fresh and engaging."
        />
        <AddBanner />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <BannerClient />
      </HydrationBoundary>
    </div>
  );
};

export default AdminBanner;
