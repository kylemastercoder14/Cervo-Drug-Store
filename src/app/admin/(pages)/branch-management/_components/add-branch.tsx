"use client";

import BranchForm from "@/components/form/branch-form";
import { Button } from "@/components/ui/button";
import { IconCirclePlus } from "@tabler/icons-react";
import React, { useState } from "react";

const AddBranch = () => {
  const [openBranchModal, setOpenBranchModal] = useState(false);
  return (
    <>
      <Button onClick={() => setOpenBranchModal(true)}>
        <IconCirclePlus className="size-4" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Branch
        </span>
      </Button>

      {openBranchModal && (
        <BranchForm
          initialData={null}
          onClose={() => setOpenBranchModal(false)}
        />
      )}
    </>
  );
};

export default AddBranch;
