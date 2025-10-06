/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { PromotionValidation } from "@/lib/validators";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Modal } from "../ui/modal";
import { useSavePromotion } from "@/data/promotion";

const PromotionForm = ({
  initialData,
  onClose,
}: {
  initialData: any;
  onClose: () => void;
}) => {
  const title = initialData ? "Edit Promotion" : "Add Promotion";
  const description = initialData
    ? "Make sure to click save changes after you update the promotion."
    : "Please fill the required fields to add a new promotion.";
  const action = initialData ? "Save Changes" : "Save Promotion";
  const form = useForm<z.infer<typeof PromotionValidation>>({
    resolver: zodResolver(PromotionValidation),
    mode: "onChange",
    defaultValues: initialData
      ? {
          ...initialData,
          image: initialData.promotion ?? "",
          isFeatured: initialData.iSFeatured ?? true,
        }
      : {
          image: "",
          isFeatured: true,
        },
  });

  const { mutate: savePromotion, isPending: isSaving } = useSavePromotion(
    initialData ?? ""
  );

  async function onSubmit(values: z.infer<typeof PromotionValidation>) {
    savePromotion(values, {
      onSuccess: () => onClose(),
    });
  }

  return (
    <>
      <Modal
        className="max-w-lg"
        isOpen={true}
        onClose={onClose}
        title={title}
        description={description}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mx-auto grid flex-1 auto-rows-max gap-4">
              <div className="grid gap-4">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.DROP_ZONE}
                  label="Image"
                  isRequired={true}
                  name="image"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SWITCH}
                  label="Featured"
                  description="This promotion will be featured on the homepage."
                  isRequired={true}
                  name="isFeatured"
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
    </>
  );
};

export default PromotionForm;
