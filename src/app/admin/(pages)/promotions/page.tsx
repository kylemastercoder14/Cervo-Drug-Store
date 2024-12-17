
import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import { getAllPromotion } from "@/actions/promotion";
import PromotionClient from "./_components/client";
import AddPromotion from "./_components/add-promotion";

const AdminPromotion = async () => {
  const queryClient = new QueryClient();

  // Prefetch the data from the server
  await queryClient.prefetchQuery({
    queryKey: ["promotions"],
    queryFn: getAllPromotion,
  });

  // Hydrate the query data for the client
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="grid py-5 items-start gap-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Manage Promotions"
          description="View, add, and manage the promotions displayed across your platform. Easily update existing promotions or create new ones to keep your site fresh and engaging."
        />
        <AddPromotion />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <PromotionClient />
      </HydrationBoundary>
    </div>
  );
};

export default AdminPromotion;
