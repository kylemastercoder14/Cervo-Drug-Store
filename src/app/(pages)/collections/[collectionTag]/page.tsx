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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  IconColumns2,
  IconColumns3,
  IconLayoutBottombar,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductsContent from "@/components/landing-page/products";
import Footer from "@/components/landing-page/footer";
import { usePathname } from "next/navigation";
import { Categories, Products } from "@prisma/client";
import { getProductsByCategory } from "@/actions/product";
import Loading from "@/app/loading";

interface ProductWithCategory extends Products {
  category: Categories | null;
}

const Collection = () => {
  const pathname = usePathname();
  const categoryTag = pathname?.split("/").pop();
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>("Featured");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const response = await getProductsByCategory(categoryTag as string);
      if (response.data) {
        setProducts(response.data);
      } else {
        console.error(response.error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [categoryTag]);

  const handleSort = (option: string) => {
    setSortOption(option);

    const sortedProducts = [...products];
    switch (option) {
      case "Alphabetically, A-Z":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Alphabetically, Z-A":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "Price, Low to High":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "Price, High to Low":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "Date, Old to New":
        sortedProducts.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "Date, New to Old":
        sortedProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }

    setProducts(sortedProducts);
  };

  if (loading) return <Loading />;
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
              <BreadcrumbPage className="text-[16px] capitalize">
                {categoryTag?.split("-").join(" ")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-5">
          <div>
            <div className="bg-[#EEEEEE] flex justify-between items-center rounded-lg py-2 px-5 shadow-md border">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-3">
                  <Label>Sort by:</Label>
                  <Select onValueChange={handleSort} defaultValue={sortOption}>
                    <SelectTrigger className="bg-white w-[180px]">
                      <SelectValue placeholder="Featured" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alphabetically, A-Z">
                        Alphabetically, A-Z
                      </SelectItem>
                      <SelectItem value="Alphabetically, Z-A">
                        Alphabetically, Z-A
                      </SelectItem>
                      <SelectItem value="Price, Low to High">
                        Price, Low to High
                      </SelectItem>
                      <SelectItem value="Price, High to Low">
                        Price, High to Low
                      </SelectItem>
                      <SelectItem value="Date, Old to New">
                        Date, Old to New
                      </SelectItem>
                      <SelectItem value="Date, New to Old">
                        Date, New to Old
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="font-semibold text-muted-foreground">
                  {products.length} Products
                </p>
              </div>
            </div>
            {products.length !== 0 ? (
              <ProductsContent loading={loading} items={products} columns={4} />
            ) : (
              <div className="flex justify-center items-center h-[400px]">
                <p className="text-lg font-semibold text-muted-foreground">
                  No products found.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Collection;
