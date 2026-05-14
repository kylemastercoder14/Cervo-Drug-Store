"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { respondToShippingFeeOffer } from "@/actions/order";
import { formatPrice } from "@/lib/utils";

type ShippingFeeResponseProps = {
  orderId: string;
  deliveryFee: number;
};

const ShippingFeeResponse = ({
  orderId,
  deliveryFee,
}: ShippingFeeResponseProps) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleDecision = async (decision: "accept" | "reject") => {
    setLoading(true);

    const result = await respondToShippingFeeOffer(orderId, decision);

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success(result.success);
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-5">
      <h3 className="text-base font-bold text-amber-950">
        Shipping Fee Confirmation Required
      </h3>
      <p className="mt-2 text-sm text-amber-900">
        The store has offered a shipping fee of{" "}
        <span className="font-semibold">{formatPrice(deliveryFee)}</span> for
        your order. Please accept or reject this offer before the order can be
        processed.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          onClick={() => handleDecision("accept")}
          disabled={loading}
        >
          Accept Shipping Fee
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleDecision("reject")}
          disabled={loading}
        >
          Reject Offer
        </Button>
      </div>
    </div>
  );
};

export default ShippingFeeResponse;
