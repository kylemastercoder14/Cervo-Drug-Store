"use client";
import CareerForm from "@/components/form/career-form";
import { Button } from "@/components/ui/button";
import { IconCirclePlus } from "@tabler/icons-react";
import React, { useState } from "react";

const AddCareer = () => {
  const [openCareerModal, setOpenCareerModal] = useState(false);
  return (
    <>
      <Button onClick={() => setOpenCareerModal(true)}>
        <IconCirclePlus className="size-4" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Career
        </span>
      </Button>

      {openCareerModal && (
        <CareerForm onClose={() => setOpenCareerModal(false)} />
      )}
    </>
  );
};

export default AddCareer;

