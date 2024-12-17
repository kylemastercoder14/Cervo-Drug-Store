import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import { getAllCustomers } from "@/actions/customers";
import CustomerClient from "./_components/client";

const AdminCustomers = async () => {
  const queryClient = new QueryClient();

  // Prefetch the data from the server
  await queryClient.prefetchQuery({
    queryKey: ["customers"],
    queryFn: getAllCustomers,
  });

  // Hydrate the query data for the client
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="grid py-5 items-start gap-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Manage Customers"
          description="Effortlessly and manage customers to keep your platform dynamic and engaging."
        />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <CustomerClient />
      </HydrationBoundary>
    </div>
  );
};

export default AdminCustomers;
