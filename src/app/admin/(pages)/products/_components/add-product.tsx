"use client";
import ProductForm from "@/components/form/product-form";
import { Button } from "@/components/ui/button";
import { IconCirclePlus } from "@tabler/icons-react";
import React, { useState } from "react";

const AddProduct = () => {
  const [openProductModal, setOpenProductModal] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpenProductModal(true)}
        size="sm"
        className="h-7 gap-1"
      >
        <IconCirclePlus className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Product
        </span>
      </Button>

      {openProductModal && (
        <ProductForm
          onClose={() => setOpenProductModal(false)}
        />
      )}
    </>
  );
};

export default AddProduct;
