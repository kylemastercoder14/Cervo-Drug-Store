"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Clock } from "lucide-react";

const CareerDetailModal = ({
  career,
  isOpen,
  onClose,
}: {
  career: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!career) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{career.jobTitle}</DialogTitle>
              <div className="flex items-center gap-4 flex-wrap">
                <Badge variant="outline" className="text-sm">
                  {career.department}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{career.jobLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    {career.experienceNeeded}
                    {career.yearsOfExperience && ` (${career.yearsOfExperience} years)`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Description
            </h3>
            <div
              className="prose prose-sm max-w-none text-gray-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2 [&_li]:mb-1 [&_p]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2"
              dangerouslySetInnerHTML={{ __html: career.jobDescription || "" }}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Job Qualifications</h3>
            <div
              className="prose prose-sm max-w-none text-gray-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2 [&_li]:mb-1 [&_p]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2"
              dangerouslySetInnerHTML={{ __html: career.jobQualification || "" }}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CareerDetailModal;

