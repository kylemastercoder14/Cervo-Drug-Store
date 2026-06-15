import Navbar from "@/components/landing-page/navbar";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import Footer from "@/components/landing-page/footer";
import FeaturedProducts from "@/components/landing-page/featured-products";
import db from "@/lib/db";
import SingleProductClient from "./client";
import { notFound } from "next/navigation";

const ViewProduct = async (props: {
  params: Promise<{
    productTag: string;
  }>;
}) => {
  const params = await props.params;
  const decodedParams = decodeURIComponent(params.productTag);
  const product = await db.products.findFirst({
    where: {
      OR: [{ id: decodedParams }, { tags: decodedParams }],
    },
    include: {
      orderItems: true,
    },
  });

  if (!product) {
    notFound();
  }

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
              <BreadcrumbLink className="text-[16px]" href="/products">
                Products
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
        <SingleProductClient product={product} />
      </div>
      <div className="bg-[#eeeeee]">
        <div className="px-4 xl:px-60 py-5 mt-5">
          <div className="bg-white mb-3 flex justify-between items-center rounded-lg py-3 px-5 shadow-md border">
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
