"use client";

import NewsEventForm from "@/components/form/news-event-form";
import { Button } from "@/components/ui/button";
import { IconCirclePlus } from "@tabler/icons-react";
import React, { useState } from "react";

const AddNewsEvents = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpenModal(true)}
      >
        <IconCirclePlus className="size-4" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add News/Event
        </span>
      </Button>

      {openModal && (
        <NewsEventForm
          initialData={null}
          onClose={() => setOpenModal(false)}
        />
      )}
    </>
  );
};

export default AddNewsEvents;
