"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Categories } from "@prisma/client";
import { toast } from "sonner";
import { getAllCategories } from "@/actions/category";
import Link from "next/link";

const CategoriesCarousel = () => {
  const [categories, setCategories] = useState<Categories[]>([]);
  useEffect(() => {
    const fetchPromotions = async () => {
      const response = await getAllCategories();
      if (response.data) {
        setCategories(response.data);
      } else {
        toast.error(response.error || "An error occurred");
      }
    };

    fetchPromotions();
  }, []);

  return (
    <Carousel className="w-full">
      <CarouselContent className="flex space-x-4">
        {categories.map((item) => (
          <CarouselItem
            key={item.id}
            className="flex flex-col items-center justify-center p-4 lg:basis-[15%]"
          >
            <Link
              href={`/products?category=${encodeURIComponent(item.tags)}`}
              className="flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={300}
                height={300}
                className="object-contain"
              />
              <p className="text-center font-semibold mt-2">{item.name}</p>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default CategoriesCarousel;
