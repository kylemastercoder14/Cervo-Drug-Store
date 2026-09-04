import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import PaymentMethodClient from "./_components/client";
import { getAllPaymentMethods } from "@/actions/payment-method";
import AddPaymentMethod from "./_components/add-payment-method";

const AdminPaymentMethods = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["payment-methods"],
    queryFn: getAllPaymentMethods,
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="grid py-5 items-start gap-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Payment Methods"
          description="Create and manage bank, e-wallet, and credit card payment options."
        />
        <AddPaymentMethod />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <PaymentMethodClient />
      </HydrationBoundary>
    </div>
  );
};

export default AdminPaymentMethods;
