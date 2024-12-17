/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { ProductValidation } from "@/lib/validators";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Modal } from "../ui/modal";
import { Categories } from "@prisma/client";
import { getAllCategories } from "@/actions/category";
import { useSaveProduct } from "@/data/product";

const ProductForm = ({
  initialData,
  onClose,
}: {
  initialData: any;
  onClose: () => void;
}) => {
  const [categories, setCategories] = useState<Categories[]>([]);

  const title = initialData ? "Edit Product" : "Add Product";
  const description = initialData
    ? "Make sure to click save changes after you update the product."
    : "Please fill the required fields to add a new product.";
  const action = initialData ? "Save Changes" : "Save Product";

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getAllCategories();
      if (response.data) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const form = useForm<z.infer<typeof ProductValidation>>({
    resolver: zodResolver(ProductValidation),
    mode: "onChange",
    defaultValues: initialData
      ? {
          name: initialData.name ?? "",
          image: initialData.image ?? "",
          price: parseFloat(initialData.price.replace("₱", "")) || 0,
          description: initialData.description ?? "",
          category: initialData?.categoryId ?? "",
          isFeatured: initialData.isFeatured ?? false,
          isPrescriptionRequired: initialData.isPrescription ?? false,
          discountedPrice: parseFloat(initialData.discountedPrice.replace("₱", "")) || 0,
        }
      : {
          image: "",
          name: "",
          description: "",
          price: 0,
          category: "",
          isFeatured: true,
          isPrescriptionRequired: false,
          discountedPrice: 0,
        },
  });

  const { mutate: saveProduct, isPending: isSaving } = useSaveProduct(
    initialData ?? ""
  );

  async function onSubmit(values: z.infer<typeof ProductValidation>) {
    saveProduct(values, {
      onSuccess: () => onClose(),
    });
  }

  return (
    <>
      <Modal
        className="max-w-2xl max-h-[90vh] overflow-auto"
        isOpen={true}
        onClose={onClose}
        title={title}
        description={description}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mx-auto grid auto-rows-max gap-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    label="Name"
                    placeholder="Enter product name"
                    isRequired={true}
                    name="name"
                    disabled={isSaving}
                  />
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.SELECT}
                    label="Category"
                    placeholder="Select product category"
                    isRequired={true}
                    dynamicOptions={categories.map((category) => ({
                      label: category.name,
                      value: category.tags,
                    }))}
                    name="category"
                    disabled={isSaving}
                  />
                </div>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    label="Original Price"
                    type="number"
                    placeholder="Enter product original price"
                    isRequired={true}
                    name="price"
                    disabled={isSaving}
                  />
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    label="Discounted Price"
                    type="number"
                    placeholder="Enter discounted price"
                    isRequired={false}
                    name="discountedPrice"
                    disabled={isSaving}
                  />
                </div>

                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.RICHTEXT}
                  label="Description"
                  isRequired={true}
                  name="description"
                  disabled={isSaving}
                />
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
                  description="This product will be featured on the homepage."
                  isRequired={true}
                  name="isFeatured"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SWITCH}
                  label="Prescription Required"
                  description="Toggle this option if the product requires a valid prescription from a healthcare provider before purchase."
                  isRequired={true}
                  name="isPrescriptionRequired"
                  disabled={isSaving}
                />
                <Button type="submit" disabled={isSaving} size="sm">
                  {isSaving && <Loader className="animate-spin w-4 h-4 mr-2" />}
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

export default ProductForm;
