"use client";

import PromotionForm from "@/components/form/promotion-form";
import { Button } from "@/components/ui/button";
import { IconCirclePlus } from "@tabler/icons-react";
import React, { useState } from "react";

const AddPromotion = () => {
  const [openPromotionModal, setOpenPromotionModal] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpenPromotionModal(true)}
      >
        <IconCirclePlus className="size-4" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Promotion
        </span>
      </Button>

      {openPromotionModal && (
        <PromotionForm
          initialData={null}
          onClose={() => setOpenPromotionModal(false)}
        />
      )}
    </>
  );
};

export default AddPromotion;
