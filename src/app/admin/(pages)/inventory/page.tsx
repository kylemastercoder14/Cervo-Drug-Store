import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import InventoryClient from "./_components/client";
import { getAllInventory } from "@/actions/inventory";
import AddInventory from "./_components/add-inventory";

const AdminInventory = async () => {
  const queryClient = new QueryClient();

  // Prefetch the data from the server
  await queryClient.prefetchQuery({
    queryKey: ["inventory"],
    queryFn: getAllInventory,
  });

  // Hydrate the query data for the client
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="grid py-5 items-start gap-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Manage Inventories"
          description="Effortlessly manage your inventory items by viewing, adding, and updating them in real-time."
        />

        <AddInventory />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <InventoryClient />
      </HydrationBoundary>
    </div>
  );
};

export default AdminInventory;
