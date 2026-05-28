"use client";

import LaboratoryServiceForm from "@/components/form/laboratory-service-form";
import { Button } from "@/components/ui/button";
import { IconCirclePlus } from "@tabler/icons-react";
import React, { useState } from "react";

const AddLaboratoryService = () => {
  const [openLaboratoryServiceModal, setOpenLaboratoryServiceModal] =
    useState(false);

  return (
    <>
      <Button onClick={() => setOpenLaboratoryServiceModal(true)}>
        <IconCirclePlus className="size-4" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Laboratory Category
        </span>
      </Button>

      {openLaboratoryServiceModal && (
        <LaboratoryServiceForm
          initialData={null}
          onClose={() => setOpenLaboratoryServiceModal(false)}
        />
      )}
    </>
  );
};

export default AddLaboratoryService;
