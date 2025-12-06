import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import { getAllCareers } from "@/actions/career";
import CareerClient from "./_components/client";
import AddCareer from "./_components/add-career";

const AdminCareers = async () => {
  const queryClient = new QueryClient();

  // Prefetch the data from the server
  await queryClient.prefetchQuery({
    queryKey: ["careers"],
    queryFn: getAllCareers,
  });

  // Hydrate the query data for the client
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="grid py-5 items-start gap-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Manage Careers"
          description="Manage job postings and career opportunities."
        />
        <AddCareer />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <CareerClient />
      </HydrationBoundary>
    </div>
  );
};

export default AdminCareers;

