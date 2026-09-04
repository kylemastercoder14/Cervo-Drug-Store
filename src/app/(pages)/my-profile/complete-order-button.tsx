"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { completeOrder } from "@/actions/order";
import { Button } from "@/components/ui/button";
import AlertModal from "@/components/ui/alert-modal";

type CompleteOrderButtonProps = {
  orderId: string;
};

const CompleteOrderButton = ({ orderId }: CompleteOrderButtonProps) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onConfirm = async () => {
    setLoading(true);

    const result = await completeOrder(orderId);

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success(result.success);
    setOpen(false);
    setLoading(false);
    router.refresh();
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title="Mark this order as completed?"
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={loading}
        onClick={() => setOpen(true)}
        className="gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
      >
        <CheckCircle2 className="h-4 w-4" />
        Complete Order
      </Button>
    </>
  );
};

export default CompleteOrderButton;
