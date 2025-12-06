/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import CustomFormField from "@/components/globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Modal } from "@/components/ui/modal";
import { useSaveCareer } from "@/data/career";
import { getCareerById } from "@/actions/career";

const CareerValidation = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  department: z.string().min(1, "Department is required"),
  jobLocation: z.string().min(1, "Job location is required"),
  experienceNeeded: z.enum(["With Experience", "No Experience Required"]),
  yearsOfExperience: z.number().int().min(0).optional(),
  jobDescription: z.string().min(1, "Job description is required"),
  jobQualification: z.string().min(1, "Job qualification is required"),
  isActive: z.boolean().optional().default(true),
});

const CareerForm = ({
  careerId,
  onClose,
}: {
  careerId?: string | null;
  onClose: () => void;
}) => {
  const [career, setCareer] = useState<any | null>(null);

  const title = careerId ? "Edit Career" : "Add Career";
  const description = careerId
    ? "Make sure to click save changes after you update the career."
    : "Please fill the required fields to add a new career position.";
  const action = careerId ? "Save Changes" : "Save Career";

  const form = useForm({
    resolver: zodResolver(CareerValidation),
    mode: "onChange",
    defaultValues: {
      jobTitle: "",
      department: "",
      jobLocation: "",
      experienceNeeded: "No Experience Required" as const,
      yearsOfExperience: undefined,
      jobDescription: "",
      jobQualification: "",
      isActive: true,
    },
  });

  const { reset, watch } = form;
  const experienceNeeded = watch("experienceNeeded");

  useEffect(() => {
    if (careerId) {
      const fetchCareerById = async () => {
        const response = await getCareerById(careerId);
        if (response.data) {
          setCareer(response.data);
          reset({
            jobTitle: response.data.jobTitle ?? "",
            department: response.data.department ?? "",
            jobLocation: response.data.jobLocation ?? "",
            experienceNeeded: (response.data.experienceNeeded ?? "No Experience Required") as "With Experience" | "No Experience Required",
            yearsOfExperience: response.data.yearsOfExperience ?? undefined,
            jobDescription: response.data.jobDescription ?? "",
            jobQualification: response.data.jobQualification ?? "",
            isActive: response.data.isActive ?? true,
          });
        }
      };

      fetchCareerById();
    }
  }, [careerId, reset]);

  const { mutate: saveCareer, isPending: isSaving } = useSaveCareer(
    career ?? "",
    onClose
  );

  async function onSubmit(values: z.infer<typeof CareerValidation>) {
    saveCareer(values);
  }

  return (
    <Modal
      className="max-w-3xl max-h-[90vh] overflow-auto"
      isOpen={true}
      onClose={onClose}
      title={title}
      description={description}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mx-auto grid auto-rows-max gap-4">
            <div className="grid gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                label="Job Title"
                placeholder="Enter job title"
                isRequired={true}
                name="jobTitle"
                disabled={isSaving}
              />
              <div className="grid grid-cols-2 gap-4">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  label="Department"
                  placeholder="Enter department"
                  isRequired={true}
                  name="department"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  label="Job Location"
                  placeholder="Enter job location"
                  isRequired={true}
                  name="jobLocation"
                  disabled={isSaving}
                />
              </div>
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SELECT}
                label="Experience Needed"
                isRequired={true}
                name="experienceNeeded"
                disabled={isSaving}
                dynamicOptions={[
                  { label: "No Experience Required", value: "No Experience Required" },
                  { label: "With Experience", value: "With Experience" },
                ]}
              />
              {experienceNeeded === "With Experience" && (
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  label="Years of Experience"
                  type="number"
                  placeholder="Enter years of experience"
                  isRequired={true}
                  name="yearsOfExperience"
                  disabled={isSaving}
                />
              )}
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.RICHTEXT}
                label="Job Description"
                placeholder="Enter job description"
                isRequired={true}
                name="jobDescription"
                disabled={isSaving}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.RICHTEXT}
                label="Job Qualification"
                placeholder="Enter job qualifications"
                isRequired={true}
                name="jobQualification"
                disabled={isSaving}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SWITCH}
                label="Active"
                description="Toggle this option to make the job posting active or inactive."
                isRequired={true}
                name="isActive"
                disabled={isSaving}
              />
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader className="animate-spin w-4 h-4" />}
                {action}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default CareerForm;

