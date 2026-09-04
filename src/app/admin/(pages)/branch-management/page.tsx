import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import BranchClient from "./_components/client";
import { getAllBranches } from "@/actions/branch";
import AddBranch from "./_components/add-branch";

const AdminBranchManagement = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["branches"],
    queryFn: getAllBranches,
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="grid py-5 items-start gap-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Branch Management"
          description="Create, update, and manage Cervo Drug Store branches."
        />
        <AddBranch />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <BranchClient />
      </HydrationBoundary>
    </div>
  );
};

export default AdminBranchManagement;
