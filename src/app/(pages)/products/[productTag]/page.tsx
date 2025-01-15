"use client";

import Chatbot from "@/components/landing-page/chatbot";
import Navbar from "@/components/landing-page/navbar";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { IconHeart } from "@tabler/icons-react";
import Footer from "@/components/landing-page/footer";
import Image from "next/image";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Categories, Products } from "@prisma/client";
import { getProductByTag } from "@/actions/product";
import { formatPrice } from "@/lib/utils";
import parse from "html-react-parser";
import useCart from "@/hooks/use-cart";
import FeaturedProducts from "@/components/landing-page/featured-products";

interface ProductWithCategory extends Products {
  category: Categories | null;
}

const ViewProduct = ({ params }: { params: { productTag: string } }) => {
  const [product, setProduct] = useState<ProductWithCategory | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const addToCart = useCart((state) => state.addItem);
  useEffect(() => {
    const fetchProduct = async () => {
      const response = await getProductByTag(params.productTag);
      if (!response.error) {
        if (response?.data) {
          setProduct(response.data);
        }
      } else {
        console.error(response.error);
      }
    };
    fetchProduct();
  }, [params.productTag]);

  const handleAddToCart = () => {
    addToCart({
      id: product?.id as string,
      name: product?.name as string,
      price: product?.price ?? 0,
      isPrescriptionRequired: product?.isPrescriptionRequired as boolean,
      discountedPrice: product?.discountedPrice ?? 0,
      quantity,
      category: product?.category?.name as string,
      image: product?.image as string,
      description: product?.description as string,
    });
  };
  return (
    <div className="flex relative min-h-screen w-full flex-col">
      <Navbar />
      <div className="px-4 xl:px-60 py-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-[16px]" href="/">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[16px]">
                {product?.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid xl:grid-cols-2 grid-cols-1 gap-10 mt-5">
          <div className="relative w-full h-[700px]">
            <Image
              src={product?.image as string}
              alt="Forti"
              fill
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="border-b pb-5 border-zinc-300">
              <div className="flex items-center justify-between">
                <p className="text-3xl font-semibold">{product?.name}</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {product?.discountedPrice === 0 && (
                  <p className="font-semibold text-2xl">
                    {formatPrice(product?.price ?? 0)}
                  </p>
                )}
                {product?.discountedPrice !== 0 && (
                  <p className="text-muted-foreground text-2xl line-through">
                    {product?.price !== undefined
                      ? formatPrice(product.price)
                      : "N/A"}{" "}
                  </p>
                )}
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
                variant="primary"
                className="w-full py-6"
              >
                Add To Cart
              </Button>
            </div>
            <p className="mt-4 mb-1 font-semibold text-xl">About the Product</p>
            <p>{parse(product?.description ?? "")}</p>
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
      </div>
      <div className="bg-[#eeeeee]">
        <div className="px-4 xl:px-60 py-5 mt-5">
          <div className="bg-white flex justify-between items-center rounded-lg py-3 px-5 shadow-md border">
            <p className="font-semibold text-lg">
              You may also like this products
            </p>
          </div>
          <FeaturedProducts />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewProduct;
