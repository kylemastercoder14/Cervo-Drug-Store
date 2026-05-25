"use client";

import { getFeaturedPromotion } from "@/actions/promotion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Promotions } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Autoplay from "embla-carousel-autoplay"

const PromotionContent = () => {
  const [promotions, setPromotions] = useState<Promotions[]>([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      const response = await getFeaturedPromotion();
      if (response.data) {
        setPromotions(response.data);
      } else {
        toast.error(response.error || "An error occurred");
      }
    };

    fetchPromotions();
  }, []);

  return (
    <Carousel
      opts={{
        align: "start",
        loop: promotions.length > 1,
      }}
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
      className="mt-6 w-full"
    >
      <CarouselContent>
        {promotions.map((item) => (
          <CarouselItem
            key={item.id}
            className="basis-full md:basis-1/2 lg:basis-1/3"
          >
            <div className="relative h-[240px] overflow-hidden rounded-2xl bg-muted sm:h-[320px] lg:h-[500px]">
              <Image
                src={item.image}
                alt={`Promotion ${item.id}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {promotions.length > 1 && (
        <>
          <CarouselPrevious className="left-3 top-1/2 z-10 border-none bg-background/80 shadow-md hover:bg-background md:left-4" />
          <CarouselNext className="right-3 top-1/2 z-10 border-none bg-background/80 shadow-md hover:bg-background md:right-4" />
        </>
      )}
    </Carousel>
  );
};

export default PromotionContent;
