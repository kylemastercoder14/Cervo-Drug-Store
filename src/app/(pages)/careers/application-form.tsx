"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader, X } from "lucide-react";
import CustomFormField from "@/components/globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createApplication } from "@/actions/career";
import { toast } from "sonner";
import DocumentUpload from "@/components/globals/document-uploader";
import { getActiveCareers } from "@/actions/career";

const ApplicationValidation = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  position: z.string().min(1, "Position is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  message: z.string().optional(),
  resumeUrl: z.string().min(1, "Resume is required"),
  careerId: z.string().optional(),
});

const ApplicationForm = ({
  isOpen,
  onClose,
  position,
  careerId,
}: {
  isOpen: boolean;
  onClose: () => void;
  position?: string;
  careerId?: string;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [careers, setCareers] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchCareers = async () => {
      const response = await getActiveCareers();
      if (response.data) {
        setCareers(response.data);
      }
    };
    fetchCareers();
  }, []);

  const form = useForm<z.infer<typeof ApplicationValidation>>({
    resolver: zodResolver(ApplicationValidation),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      position: position || "",
      contactNumber: "",
      email: "",
      address: "",
      message: "",
      resumeUrl: "",
      careerId: careerId || "",
    },
  });

  async function onSubmit(values: z.infer<typeof ApplicationValidation>) {
    setIsSubmitting(true);
    try {
      const response = await createApplication(values);
      if (response.success) {
        toast.success("Application submitted successfully!");
        form.reset();
        onClose();
      } else {
        toast.error(response.error || "Failed to submit application");
      }
    } catch (error) {
      toast.error("An error occurred while submitting your application");
    } finally {
      setIsSubmitting(false);
    }
  }

  const positionOptions = careers.map((career) => ({
    label: career.jobTitle,
    value: career.jobTitle,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Job Application</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                label="First Name"
                placeholder="Enter first name"
                isRequired={true}
                name="firstName"
                disabled={isSubmitting}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                label="Last Name"
                placeholder="Enter last name"
                isRequired={true}
                name="lastName"
                disabled={isSubmitting}
              />
            </div>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Middle Name"
              placeholder="Enter middle name (optional)"
              isRequired={false}
              name="middleName"
              disabled={isSubmitting}
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              label="Position"
              isRequired={true}
              name="position"
              disabled={isSubmitting}
              dynamicOptions={positionOptions}
            />
            <div className="grid grid-cols-2 gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.PHONE_INPUT}
                label="Contact Number"
                placeholder="Enter contact number"
                isRequired={true}
                name="contactNumber"
                disabled={isSubmitting}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                isRequired={true}
                name="email"
                disabled={isSubmitting}
              />
            </div>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              label="Address"
              placeholder="Enter your complete address"
              isRequired={true}
              name="address"
              disabled={isSubmitting}
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              label="Message"
              placeholder="Additional message (optional)"
              isRequired={false}
              name="message"
              disabled={isSubmitting}
            />
            <div>
              <label className="text-sm font-medium mb-2 block">
                Resume <span className="text-red-500">*</span>
              </label>
              <DocumentUpload
                onDocumentUpload={(url) => form.setValue("resumeUrl", url)}
                accept={{
                  "application/pdf": [".pdf"],
                  "application/msword": [".doc", ".docx"],
                }}
                maxSize={10 * 1024 * 1024} // 10MB
              />
              {form.formState.errors.resumeUrl && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.resumeUrl.message}
                </p>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader className="animate-spin w-4 h-4 mr-2" />}
                Submit Application
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationForm;

