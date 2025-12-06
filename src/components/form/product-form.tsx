/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { ProductValidation } from "@/lib/validators";
import CustomFormField from "@/components/globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Modal } from "@/components/ui/modal";
import { Categories } from "@prisma/client";
import { getAllCategories } from "@/actions/category";
import { useSaveProduct } from "@/data/product";
import { getProductById } from "@/actions/product";

const ProductForm = ({
  productId,
  onClose,
}: {
  productId?: string | null;
  onClose: () => void;
}) => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [product, setProduct] = useState<any | null>(null);

  const title = productId ? "Edit Product" : "Add Product";
  const description = productId
    ? "Make sure to click save changes after you update the product."
    : "Please fill the required fields to add a new product.";
  const action = productId ? "Save Changes" : "Save Product";

  const form = useForm<z.infer<typeof ProductValidation>>({
    resolver: zodResolver(ProductValidation),
    mode: "onChange",
    defaultValues: {
      name: "",
      image: "",
      price: 0,
      description: "",
      isFeatured: true,
      isVatItem: false,
      isPrescriptionRequired: false,
      categoryTag: undefined,
    },
  });

  const { reset } = form;

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getAllCategories();
      setCategories(response.data || []);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (productId) {
      const fetchProductById = async () => {
        const response = await getProductById(productId);
        if (response.data) {
          setProduct(response.data);
          reset({
            name: response.data.name ?? "",
            image: response.data.image ?? "",
            price: response.data.price ?? 0,
            description: response.data.description ?? "",
            isFeatured: response.data.isFeatured ?? true,
            isVatItem: response.data.isVatItem ?? false,
            isPrescriptionRequired:
              response.data.isPrescriptionRequired ?? false,
            categoryTag: response.data.categoryTag ?? undefined,
          });
        }
      };

      fetchProductById();
    }
  }, [productId, reset]);

  const { mutate: saveProduct, isPending: isSaving } = useSaveProduct(
    product ?? ""
  );

  async function onSubmit(values: z.infer<typeof ProductValidation>) {
    saveProduct(values);
  }

  return (
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
                fieldType={FormFieldType.INPUT}
                label="Price"
                type="number"
                placeholder="Enter product price"
                isRequired={true}
                name="price"
                disabled={isSaving}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SELECT}
                label="Category"
                placeholder="Select a category (optional)"
                isRequired={false}
                name="categoryTag"
                disabled={isSaving}
                dynamicOptions={categories.map((cat) => ({
                  label: cat.name,
                  value: cat.tags,
                }))}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.RICHTEXT}
                label="Description"
                isRequired={false}
                name="description"
                disabled={isSaving}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.DROP_ZONE}
                label="Image"
                isRequired={false}
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
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SWITCH}
                label="Value added tax exemption"
                description="Toggle this option if the product has a VAT exemption. This will be exempted from the value added tax."
                isRequired={true}
                name="isVatItem"
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

export default ProductForm;
