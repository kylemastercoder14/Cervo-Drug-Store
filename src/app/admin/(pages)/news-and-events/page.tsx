import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import { getAllNewsEvents } from "@/actions/news-events";
import { getFacebookSyncStatus, runFacebookNewsSync } from "@/lib/facebook-sync";
import NewsEventClient from "./_components/client";
import AddNewsEvents from "./_components/add-news-event";

const AdminNewsAndEvents = async () => {
  const queryClient = new QueryClient();

  try {
    await runFacebookNewsSync("facebook-to-system", "admin:news-page");
  } catch (error) {
    console.error("Failed to sync Facebook posts before rendering news page:", error);
  }

  const syncStatus = await getFacebookSyncStatus();

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
          description="Effortlessly manage your news and events by viewing, adding, and updating them in real-time."
        />

        <AddNewsEvents />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <NewsEventClient syncStatus={syncStatus} />
      </HydrationBoundary>
    </div>
  );
};

export default AdminNewsAndEvents;
