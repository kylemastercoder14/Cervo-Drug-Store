import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import { getAllNewsEvents } from "@/actions/news-events";
import NewsEventClient from "./_components/client";
import AddNewsEvents from "./_components/add-news-event";

const AdminNewsAndEvents = async () => {
  const queryClient = new QueryClient();

  // Prefetch the data from the server
  await queryClient.prefetchQuery({
    queryKey: ["news-and-events"],
    queryFn: getAllNewsEvents,
  });

  // Hydrate the query data for the client
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="grid py-5 items-start gap-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Manage News and Events"
          description="Effortlessly manage your inventory items by viewing, adding, and updating them in real-time. Whether you're updating product details, adjusting quantities, or adding new items, this section ensures your platform’s inventory stays accurate and up-to-date."
        />

        <AddNewsEvents />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <NewsEventClient />
      </HydrationBoundary>
    </div>
  );
};

export default AdminNewsAndEvents;
