"use client";

import React, { useState } from "react";
import useCart from "@/hooks/use-cart";
import { OrderItems, Products } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { extractWeight, formatPrice } from "@/lib/utils";

interface ProductClientProps extends Products {
  orderItems: OrderItems[];
}

const SingleProductClient = ({
  product,
}: {
  product: ProductClientProps | null;
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const addToCart = useCart((state) => state.addItem);

  const handleAddToCart = () => {
    addToCart({
      id: product?.id as string,
      name: product?.name as string,
      price: product?.price ?? 0,
      isPrescriptionRequired: product?.isPrescriptionRequired as boolean,
      quantity,
      isVatable: product?.isVatItem as boolean,
      tags: product?.tags as string,
      image: product?.image as string,
      description: product?.description as string,
    });
  };
  return (
    <>
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-10 mt-5">
        <div className="relative w-full h-[700px]">
          {product?.image ? (
            <Image
              src={product?.image as string}
              alt={product?.name as string}
              fill
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="relative flex items-center flex-col justify-center bg-primary/60 w-full h-[700px]">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={120}
                height={120}
                className="absolute top-10 right-10"
              />
              <div className="border-4 w-[80%] overflow-hidden text-black text-center font-semibold border-black p-3">
                {product?.name}
              </div>
              <p className="text-black text-center font-semibold mt-3">
                {extractWeight(product?.name ?? "") || ""}
              </p>
              {product?.isPrescriptionRequired && (
                <Image
                  src="/images/rx.png"
                  alt="Rx"
                  width={80}
                  height={80}
                  className="absolute bottom-5 right-5"
                />
              )}
            </div>
          )}
        </div>
        <div>
          <div className="border-b pb-5 border-zinc-300">
            <div className="flex items-center justify-between">
              <p className="text-3xl font-semibold">{product?.name}</p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <p className="font-semibold text-2xl">
                {formatPrice(product?.price ?? 0)}
              </p>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              Shipping calculated after checkout.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-10">
            <div className="flex items-center border py-2.5 px-5 gap-5">
              <MinusIcon
                className="cursor-pointer"
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                color="gray"
              />
              <input
                type="text"
                value={quantity}
                readOnly
                className="border-none bg-white outline-none text-center w-10"
              />
              <PlusIcon
                onClick={() => setQuantity(quantity + 1)}
                className="cursor-pointer"
                color="gray"
              />
            </div>
            <Button
              onClick={handleAddToCart}
              className="w-full py-6"
            >
              Add To Cart
            </Button>
          </div>
          <p className="mt-6 mb-2 font-semibold text-xl">About the Product</p>
          {product?.isPrescriptionRequired ? (
            <>
              <p>
                <b>REMINDER</b>: A doctor's prescription is required to purchase
                this product. Please upload your prescription upon checkout.
              </p>
              <p className="mt-4">
                Our pharmacist will also get in touch with you to validate your
                prescription before processing your order. This is to ensure the
                medication is suitable for your condition and that proper dosage
                instructions are followed.
              </p>
              <p className="mt-1">
                Prescription (Rx) medications are regulated to ensure safe and
                appropriate use. These medicines are used to treat various
                conditions such as chronic illnesses, bacterial infections, and
                other serious health concerns.
              </p>
              <p className="mt-1">
                Please follow your doctor's instructions carefully when taking
                this medication. Do not share prescription drugs with others, as
                they are prescribed based on individual medical history and
                needs.
              </p>
              <p className="mt-1">
                If you have any concerns about side effects, interactions with
                other medications, or proper usage, feel free to consult our
                pharmacist or your healthcare provider.
              </p>
            </>
          ) : (
            <>
              <p>
                <b>REMINDER</b>: This product is available for purchase without
                a prescription.
              </p>
              <p className="mt-4">
                Over-the-counter (OTC) medications are safe and effective when
                used as directed. These products help manage common conditions
                such as headaches, colds, allergies, digestive issues, and minor
                pain relief.
              </p>
              <p className="mt-1">
                Please read the label carefully for dosage instructions and
                potential warnings. Avoid exceeding the recommended dose to
                prevent adverse effects.
              </p>
              <p className="mt-1">
                While OTC medications do not require a prescription, they should
                still be used responsibly. If symptoms persist or worsen,
                consult a healthcare professional to determine the best course
                of treatment.
              </p>
              <p className="mt-1">
                Our pharmacists are available to assist you if you have any
                questions about selecting the right OTC medication for your
                needs.
              </p>
            </>
          )}

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">
                Senior Citizen / PWD Discount
              </AccordionTrigger>
              <AccordionContent>
                Senior Citizen and PWD discounts are now being offered to
                qualified customers. Documents such as Senior Citizen/PWD ID,
                booklet and valid prescriptions are required to avail the
                discount. Please note that the discount will not be
                automatically applied upon checkout. Final discounted amount
                will be sent via email or SMS once we have validated your
                submitted requirements.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <p className="mt-4">
            Visit our{" "}
            <Link href="/faqs" className="font-semibold underline">
              FAQs
            </Link>{" "}
            page for further details
          </p>
        </div>
      </div>
    </>
  );
};

export default SingleProductClient;
