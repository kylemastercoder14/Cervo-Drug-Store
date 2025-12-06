"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getApplicationById } from "@/actions/career";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ApplicationDetailModal = ({
  applicationId,
  isOpen,
  onClose,
  onStatusChange,
}: {
  applicationId: string;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: string, remarks?: string) => void;
}) => {
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");

  useEffect(() => {
    if (isOpen && applicationId) {
      const fetchApplication = async () => {
        setLoading(true);
        const response = await getApplicationById(applicationId);
        if (response.data) {
          setApplication(response.data);
          setSelectedStatus(response.data.status);
          setRemarks(response.data.remarks || "");
        }
        setLoading(false);
      };
      fetchApplication();
    }
  }, [isOpen, applicationId]);

  const handleStatusUpdate = () => {
    if (selectedStatus && selectedStatus !== application?.status) {
      onStatusChange(selectedStatus, remarks);
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-8">
            <Loader className="animate-spin h-6 w-6" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!application) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <p>Application not found</p>
        </DialogContent>
      </Dialog>
    );
  }

  const statusVariant =
    application.status === "APPROVED"
      ? "default"
      : application.status === "REJECTED"
      ? "destructive"
      : application.status === "REVIEWING"
      ? "secondary"
      : "outline";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-base font-semibold">
                {application.firstName}{" "}
                {application.middleName && `${application.middleName} `}
                {application.lastName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Position</label>
              <p className="text-base font-semibold">{application.position}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-base">{application.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Contact Number</label>
              <p className="text-base">{application.contactNumber}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-500">Address</label>
              <p className="text-base">{application.address}</p>
            </div>
            {application.message && (
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-500">Message</label>
                <p className="text-base">{application.message}</p>
              </div>
            )}
            {application.remarks && (
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-500">Previous Remarks</label>
                <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-gray-700">{application.remarks}</p>
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge variant={statusVariant}>{application.status}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Resume</label>
              <div className="mt-1">
                <Link
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Resume →
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Update Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="REVIEWING">REVIEWING</SelectItem>
                  <SelectItem value="APPROVED">APPROVED</SelectItem>
                  <SelectItem value="REJECTED">REJECTED</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="remarks" className="text-sm font-medium mb-2 block">
                Remarks <span className="text-gray-500 text-xs">(Optional - will be included in email notification)</span>
              </Label>
              <Textarea
                id="remarks"
                placeholder="Add remarks or feedback for the applicant..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be sent to the applicant via email along with the status update.
              </p>
            </div>
            <Button
              onClick={handleStatusUpdate}
              disabled={selectedStatus === application.status}
              className="w-full"
            >
              Update Status & Send Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailModal;

