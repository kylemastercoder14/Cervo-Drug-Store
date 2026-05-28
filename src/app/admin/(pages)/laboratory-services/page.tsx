import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import LaboratoryServiceClient from "./_components/client";
import { getAllLaboratoryServiceCategories } from "@/actions/laboratory-services";
import AddLaboratoryService from "./_components/add-laboratory-service";

const AdminLaboratoryServices = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["laboratory-services"],
    queryFn: getAllLaboratoryServiceCategories,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="grid items-start gap-4 py-5">
      <div className="flex items-center justify-between">
        <Heading
          title="Manage Laboratory Services"
          description="Create categories like Serology or Hematology and manage the services shown on the website."
        />
        <AddLaboratoryService />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <LaboratoryServiceClient />
      </HydrationBoundary>
    </div>
  );
};

export default AdminLaboratoryServices;
