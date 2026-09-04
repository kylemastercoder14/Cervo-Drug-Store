import React from "react";
import Navbar from "@/components/landing-page/navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductClient from "./client";
import db from "@/lib/db";
import { getProductsByCategory } from "@/actions/product";
import { getCategoryByTag } from "@/actions/category";

interface ProductsProps {
  searchParams: { category?: string; search?: string };
}

const Products = async ({ searchParams }: ProductsProps) => {
  const categoryTag = searchParams?.category;
  const searchQuery = searchParams?.search?.trim() || "";
  let products;
  let categoryName = null;

  if (searchQuery) {
    products = await db.products.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            tags: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        orderItems: true,
      },
    });
  } else if (categoryTag) {
    // Get products by category
    const categoryResponse = await getCategoryByTag(categoryTag);
    if (categoryResponse?.data) {
      categoryName = categoryResponse.data.name;
    }

    const productsResponse = await getProductsByCategory(categoryTag);
    // If category doesn't exist or has no products, show empty array
    products = productsResponse?.data || [];
  } else {
    // Get all products
    products = await db.products.findMany({
      include: {
        orderItems: true,
      },
    });
  }

  return (
    <div className="flex relative min-h-screen w-full flex-col">
      <Navbar />
      <div className="w-full xl:px-60 px-4 py-5 h-full mx-auto">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-[16px]" href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-[16px]" href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            {categoryName && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[16px]">{categoryName}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        {(categoryName || searchQuery) && (
          <div className="mt-4 mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Search results for "${searchQuery}"` : categoryName}
              </h1>
              <p className="text-gray-600 mt-1">
                {products.length} {products.length === 1 ? "product" : "products"} found
              </p>
            </div>
            <BreadcrumbLink
              href="/products"
              className="text-[16px] text-primary hover:underline"
            >
              View All Products →
            </BreadcrumbLink>
          </div>
        )}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-xl font-semibold text-gray-600 mb-2">
              {searchQuery
                ? `No products found for "${searchQuery}"`
                : "No products found in this category"}
            </p>
            <BreadcrumbLink
              href="/products"
              className="text-[16px] text-primary hover:underline"
            >
              View All Products →
            </BreadcrumbLink>
          </div>
        ) : (
          <ProductClient products={products} />
        )}
      </div>
    </div>
  );
};

export default Products;
