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
  const [columns, setColumns] = useState(3);
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
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
  const handleColumnChange = (col: number) => {
    setColumns(col);
  };

  if(loading) return (
    <Loading />
  );
  return (
    <div className="flex relative min-h-screen w-full flex-col">
      <Chatbot />
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
        <div className="grid xl:grid-cols-4 grid-cols-1 gap-10 mt-5">
          <div className="col-span-1">
            <div className="flex justify-between items-center">
              <p className="text-2xl font-semibold">Filter:</p>
              <p className="text-sm font-semibold underline">Reset</p>
            </div>
            <Accordion type="multiple">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-md">
                  AVAILABILITY
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        In stock (3)
                      </label>
                    </div>
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Out of stock (0)
                    </label>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-md">PRICE</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3">The highest price is ₱180.00</p>
                  <div className="flex items-center gap-3 px-1">
                    <div>
                      <Label>From:</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label>To:</Label>
                      <Input type="number" placeholder="180.00" />
                    </div>
                  </div>
                  <Slider
                    className="mt-5"
                    defaultValue={[33]}
                    max={100}
                    step={1}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="col-span-3">
            <div className="bg-[#EEEEEE] flex justify-between items-center rounded-lg py-2 px-5 shadow-md border">
              <div className="flex items-center gap-2">
                <Button
                  variant={columns === 3 ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => handleColumnChange(3)}
                >
                  <IconColumns3 />
                </Button>
                <Button
                  variant={columns === 2 ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => handleColumnChange(2)}
                >
                  <IconColumns2 />
                </Button>
                <Button
                  variant={columns === 1 ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => handleColumnChange(1)}
                >
                  <IconLayoutBottombar />
                </Button>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-3">
                  <Label>Sort by:</Label>
                  <Select>
                    <SelectTrigger className="bg-white w-[180px]">
                      <SelectValue placeholder="Featured" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Featured">Featured</SelectItem>
                      <SelectItem value="Best Selling">Best Selling</SelectItem>
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
              <ProductsContent
                loading={loading}
                items={products}
                columns={columns}
              />
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
