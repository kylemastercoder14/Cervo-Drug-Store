"use client";

import { OrderItems, Products } from "@prisma/client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { extractWeight } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ProductClientProps extends Products {
  orderItems: OrderItems[];
}

const ProductClient = ({ products }: { products: ProductClientProps[] }) => {
  const router = useRouter();
  const maxPrice = React.useMemo(
    () => (products.length > 0 ? Math.max(...products.map((p) => p.price)) : 1),
    [products]
  );

  const [filteredProducts, setFilteredProducts] =
    React.useState<ProductClientProps[]>(products);
  const [availability, setAvailability] = React.useState("all");
  const [priceRange, setPriceRange] = React.useState([0, maxPrice]);
  const [sortBy, setSortBy] = React.useState("All");
  const [visibleProducts, setVisibleProducts] = React.useState(20);
  const [showScrollToTop, setShowScrollToTop] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setPriceRange([0, maxPrice]);
    setVisibleProducts(20);
  }, [maxPrice, products]);

  React.useEffect(() => {
    let tempProducts = [...products];

    if (availability === "inStock") {
      tempProducts = tempProducts.filter((p) => p.status === "Available");
    } else if (availability === "outOfStock") {
      tempProducts = tempProducts.filter((p) => p.status === "Not available");
    }

    tempProducts = tempProducts.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (sortBy) {
      tempProducts.sort((a, b) => {
        switch (sortBy) {
          case "All":
            return 0;
          case "Featured":
            return b.isFeatured === true ? 1 : -1;
          case "Best Selling":
            return (b.orderItems?.length || 0) - (a.orderItems?.length || 0);
          case "Price, low to high":
            return a.price - b.price;
          case "Price, high to low":
            return b.price - a.price;
          case "Alphabetically, A-Z":
            return a.name.localeCompare(b.name);
          case "Alphabetically, Z-A":
            return b.name.localeCompare(a.name);
          case "Date, new to old":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "Date, old to new":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          default:
            return 0;
        }
      });
    }

    setFilteredProducts(tempProducts);
  }, [availability, priceRange, sortBy, products]);

  const handleViewMore = () => {
    setVisibleProducts((prev) => prev + 20);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="grid lg:grid-cols-5 grid-cols-1 gap-5 mt-5">
        <div className="lg:col-span-1 pr-1">
          <h1 className="text-xl font-semibold">Filter:</h1>
          <Accordion type="single" collapsible>
            <AccordionItem value="status">
              <AccordionTrigger>Availability</AccordionTrigger>
              <AccordionContent>
                <RadioGroup
                  value={availability}
                  onValueChange={setAvailability}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inStock" id="inStock" />
                    <Label htmlFor="inStock">
                      In stock (
                      {products.filter((p) => p.status === "Available").length})
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="outOfStock" id="outOfStock" />
                    <Label htmlFor="outOfStock">
                      Out of stock (
                      {
                        products.filter((p) => p.status === "Not available")
                          .length
                      }
                      )
                    </Label>
                  </div>
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="price">
              <AccordionTrigger>Price</AccordionTrigger>
              <AccordionContent>
                <p>The highest price is ₱{maxPrice.toFixed(2)}</p>
                <div className="flex items-center mb-5 mt-4 gap-5">
                  <div className="space-y-1">
                    <label
                      htmlFor="from"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      From
                    </label>
                    <Input
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      type="number"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="to"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      To
                    </label>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                    />
                  </div>
                </div>
                <Slider
                  defaultValue={[priceRange[0]]}
                  max={maxPrice}
                  step={1}
                  onValueChange={(value) =>
                    setPriceRange([value[0], priceRange[1]])
                  }
                />
                <p className="mt-2 text-muted-foreground text-sm">
                  Adjust the price by sliding. Minimum: ₱0, Maximum: ₱
                  {maxPrice.toFixed(2)}.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="lg:col-span-4">
          <div className="w-full flex items-center justify-between bg-zinc-200 rounded-[6px] px-5 py-3">
            <div className="flex items-center gap-2">
              <label>Sort by:</label>
              <Select
                onValueChange={(value) => setSortBy(value)}
                defaultValue={sortBy}
              >
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Select sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Featured">Featured</SelectItem>
                  <SelectItem value="Best Selling">Best Selling</SelectItem>
                  <SelectItem value="Alphabetically, A-Z">
                    Alphabetically, A-Z
                  </SelectItem>
                  <SelectItem value="Alphabetically, Z-A">
                    Alphabetically, Z-A
                  </SelectItem>
                  <SelectItem value="Price, low to high">
                    Price, low to high
                  </SelectItem>
                  <SelectItem value="Price, high to low">
                    Price, high to low
                  </SelectItem>
                  <SelectItem value="Date, old to new">
                    Date, old to new
                  </SelectItem>
                  <SelectItem value="Date, new to old">
                    Date, new to old
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p>
              {Math.min(visibleProducts, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
            </p>
          </div>
          <div className="grid lg:grid-cols-4 grid-cols-1 gap-5 mt-5">
            {filteredProducts.slice(0, visibleProducts).map((product) => {
              const encodedSlug = encodeURIComponent(product.tags || '');
              const productUrl = `/products/${encodedSlug}`;
              return (
                <div key={product.id}>
                <div className="relative flex items-center flex-col justify-center bg-primary/60 w-full h-[30vh]">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={80}
                    height={80}
                    className="absolute top-5 right-5"
                  />
                  <div className="border-4 w-[80%] overflow-hidden text-black text-center font-semibold truncate border-black p-3">
                    {product.name}
                  </div>
                  <p className="text-black text-center font-semibold mt-3">
                    {extractWeight(product.name) || ""}
                  </p>
                  {product.isPrescriptionRequired && (
                    <Image
                      src="/images/rx.png"
                      alt="Rx"
                      width={80}
                      height={80}
                      className="absolute bottom-5 right-5"
                    />
                  )}
                </div>
                <div className="p-3">
                  <h1 className="font-semibold line-clamp-1 text-lg">
                    {product.isPrescriptionRequired ? "Rx:" : ""} {product.name}
                  </h1>
                  <p className="text-base font-semibold">
                    ₱{product.price.toFixed(2)}
                  </p>
                  <Button
                    onClick={() => router.push(productUrl)}
                    className="w-full mt-3"
                  >
                    View Details &rarr;
                  </Button>
                </div>
              </div>
              )
            })}
          </div>
          {visibleProducts < filteredProducts.length && (
            <Button
              variant="secondary"
              className="mt-10 mx-auto flex items-center justify-center"
              onClick={handleViewMore}
            >
              View More &rarr;
            </Button>
          )}
        </div>
      </div>
      {showScrollToTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed rounded-full bottom-10 right-10"
        >
          <ChevronUp className="size-5" />
        </Button>
      )}
    </div>
  );
};

export default ProductClient;
