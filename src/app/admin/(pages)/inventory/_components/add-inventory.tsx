"use client";

import InventoryForm from "@/components/form/inventory-form";
import { Button } from "@/components/ui/button";
import { IconCirclePlus } from "@tabler/icons-react";
import React, { useState } from "react";

const AddInventory = () => {
  const [openBannerModal, setOpenBannerModal] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpenBannerModal(true)}
        size="sm"
        className="h-7 gap-1"
      >
        <IconCirclePlus className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Inventory
        </span>
      </Button>

      {openBannerModal && (
        <InventoryForm
          initialData={null}
          onClose={() => setOpenBannerModal(false)}
        />
      )}
    </>
  );
};

export default AddInventory;
