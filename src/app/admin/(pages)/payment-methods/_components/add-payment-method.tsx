"use client";

import PaymentMethodForm from "@/components/form/payment-method-form";
import { Button } from "@/components/ui/button";
import { IconCirclePlus } from "@tabler/icons-react";
import React, { useState } from "react";

const AddPaymentMethod = () => {
  const [openPaymentMethodModal, setOpenPaymentMethodModal] = useState(false);
  return (
    <>
      <Button onClick={() => setOpenPaymentMethodModal(true)}>
        <IconCirclePlus className="size-4" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Payment Method
        </span>
      </Button>

      {openPaymentMethodModal && (
        <PaymentMethodForm
          initialData={null}
          onClose={() => setOpenPaymentMethodModal(false)}
        />
      )}
    </>
  );
};

export default AddPaymentMethod;
