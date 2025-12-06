"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import ApplicationForm from "./application-form";
import CareerDetailModal from "./career-detail-modal";

const CareersClient = ({ career }: { career: any }) => {
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        {career && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setIsDetailOpen(true)}
          >
            View Details
          </Button>
        )}
        <Button
          variant={career ? "default" : "default"}
          className={career ? "flex-1 bg-primary hover:bg-primary/90" : "w-full bg-primary hover:bg-primary/90"}
          onClick={() => setIsApplicationOpen(true)}
        >
          {career ? "Apply Now" : "Submit General Application"}
        </Button>
      </div>
      {career && (
        <CareerDetailModal
          career={career}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
      <ApplicationForm
        isOpen={isApplicationOpen}
        onClose={() => setIsApplicationOpen(false)}
        position={career?.jobTitle}
        careerId={career?.id}
      />
    </>
  );
};

export default CareersClient;

