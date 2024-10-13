"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useRouter } from "next/navigation";

const items = [
  {
    imageUrl: "/blogs/1.jpg",
    title: "5 Sintomas ng Kanser sa Baga",
    description:
      "Ang kanser sa baga ang isa sa mga pangunahing sanhi ng pagkamatay sa buong mundo.Tinatayang aabot sa 234,580 ang bagong kaso nitong 2024. Hindi tulad ng ibang uri ng kanser, ang mga sintomas nito ay karaniwang hindi kapansin-pansin hanggang ito ay nasa advanced stage na.",
  },
  {
    imageUrl: "/blogs/2.jpg",
    title: "Ano ang Sanhi ng Asthma?",
    description:
      "Ang asthma ay isang non-communicable disease (NCD) na p’wedeng makaapekto sa mga bata at matatanda. Mayroon itong tinatayang 262 million cases at mahigit 455,000 death cases noong 2019. Ang kondisyong ito ay nagdudulot ng pamamaga at pag-ikli ng mga airways sa baga, na nagiging sanhi ng hirap sa paghinga.",
  },
  {
    imageUrl: "/blogs/3.jpg",
    title: "5 Most Common Lung Diseases",
    description:
      "Lung diseases are among the most common medical conditions globally. In the Philippines, the death rate has reached 51.31 per 100,000 people, placing the country 14th highest in lung disease-related mortality worldwide.",
  },
];

const BlogsCarousel = () => {
  const router = useRouter();
  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-2">
        {items.map((item, index) => (
          <CarouselItem key={index} className="pl-2 md:basis-1/3">
            <div className="p-2">
              <div className="relative">
                <Image
                  src={item.imageUrl}
                  alt="Category"
                  width={300}
                  height={300}
                />
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                <p className="text-center bottom-4 inset-x-0 font-semibold text-white absolute">
                  {item.title}
                </p>
              </div>
              <p className="text-sm mt-2 line-clamp-3">{item.description}</p>
              <p
                onClick={() =>
                  router.push(
                    `/blogs/${item.title
                      .toLowerCase()
                      .replace(/,/g, "")
                      .replace(/\s+/g, "-")
                      .replace(/&/g, "and")}`
                  )
                }
                className="mt-2 hover:underline cursor-pointer font-semibold"
              >
                Read More &rarr;
              </p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default BlogsCarousel;
