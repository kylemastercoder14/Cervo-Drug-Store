"use client";

import StaffForm from "@/components/form/staff-form";
import { Button } from "@/components/ui/button";
import { IconCirclePlus } from "@tabler/icons-react";
import React, { useState } from "react";

const AddStaff = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpenModal(true)}
      >
        <IconCirclePlus className="size-4" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Staff
        </span>
      </Button>

      {openModal && (
        <StaffForm
          initialData={null}
          onClose={() => setOpenModal(false)}
        />
      )}
    </>
  );
};

export default AddStaff;
