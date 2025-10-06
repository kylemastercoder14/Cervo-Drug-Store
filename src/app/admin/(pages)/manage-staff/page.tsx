import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import { getAllStaff } from "@/actions/manage-staff";
import AddStaff from "./_components/add-staff";
import StaffClient from "./_components/client";

const AdminManageStaff = async () => {
  const queryClient = new QueryClient();

  // Prefetch the data from the server
  await queryClient.prefetchQuery({
    queryKey: ["manage-staff"],
    queryFn: getAllStaff,
  });

  // Hydrate the query data for the client
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="grid py-5 items-start gap-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Manage Staff"
          description="Effortlessly manage your staff by viewing, adding, and updating them in real-time."
        />

        <AddStaff />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <StaffClient />
      </HydrationBoundary>
    </div>
  );
};

export default AdminManageStaff;
