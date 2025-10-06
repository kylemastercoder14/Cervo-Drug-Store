import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import { getAllOrders } from "@/actions/order";
import OrdersClient from "./_components/client";

const AdminOrders = async () => {
  const queryClient = new QueryClient();

  // Prefetch the data from the server
  await queryClient.prefetchQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });

  // Hydrate the query data for the client
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="grid py-5 items-start gap-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Orders Record"
          description="Seamlessly track and manage all your orders in one place."
        />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <OrdersClient />
      </HydrationBoundary>
    </div>
  );
};

export default AdminOrders;
