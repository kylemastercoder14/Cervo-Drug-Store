/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { InventoryValidation } from "@/lib/validators";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Modal } from "../ui/modal";
import { Products } from "@prisma/client";
import { getAllProducts } from "@/actions/product";
import { useSaveInventory } from "@/data/inventory";

const InventoryForm = ({
  initialData,
  onClose,
}: {
  initialData: any;
  onClose: () => void;
}) => {
  const [products, setProducts] = useState<Products[]>([]);
  const title = initialData ? "Edit Inventory" : "Add Inventory";
  const description = initialData
    ? "Make sure to click save changes after you update the inventory."
    : "Please fill the required fields to add a new inventory.";
  const action = initialData ? "Save Changes" : "Save inventory";

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getAllProducts();
      if (response.data) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const form = useForm<z.infer<typeof InventoryValidation>>({
    resolver: zodResolver(InventoryValidation),
    mode: "onChange",
    defaultValues: initialData
      ? {
          ...initialData,
          productId: initialData.productId,
          stock: initialData.stock,
        }
      : {
          productId: "",
          stock: 0,
        },
  });

  const { mutate: saveInventory, isPending: isSaving } = useSaveInventory(
    initialData ?? ""
  );

  async function onSubmit(values: z.infer<typeof InventoryValidation>) {
    saveInventory(values, {
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
                  fieldType={FormFieldType.SELECT}
                  label="Product"
                  isRequired={true}
                  placeholder="Select product"
                  dynamicOptions={products.map((product) => ({
                    label: product.name,
                    value: product.id,
                  }))}
                  name="productId"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  label="Stock"
                  type="number"
                  placeholder="Enter product stock"
                  isRequired={true}
                  name="stock"
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

export default InventoryForm;
