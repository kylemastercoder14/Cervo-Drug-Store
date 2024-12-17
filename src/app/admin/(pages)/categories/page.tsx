import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import CategoryClient from "./_components/client";
import { getAllCategories } from "@/actions/category";
import AddCategory from "./_components/add-category";

const AdminCategory = async () => {
  const queryClient = new QueryClient();

  // Prefetch the data from the server
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  // Hydrate the query data for the client
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="grid py-5 items-start gap-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Manage Categories"
          description="Organize and manage your pharmacy's product categories. Add, edit, or remove categories to keep your product offerings well-structured and easy to navigate."
        />
        <AddCategory />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <CategoryClient />
      </HydrationBoundary>
    </div>
  );
};

export default AdminCategory;
