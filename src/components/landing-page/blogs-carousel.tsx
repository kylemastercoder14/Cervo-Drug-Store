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
import { useRouter } from "next/navigation";
import { News } from '@prisma/client';
import { toast } from 'sonner';
import { getAllNewsEvents } from '@/actions/news-events';

const BlogsCarousel = () => {
  const [blogs, setBlogs] = useState<News[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchNews = async () => {
      const response = await getAllNewsEvents();
      if (response.data) {
        setBlogs(response.data);
      } else {
        toast.error(response.error || "An error occurred");
      }
    };

    fetchNews();
  }, []);
  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-2">
        {blogs.map((item, index) => (
          <CarouselItem key={index} className="pl-2 md:basis-1/3">
            <div className="p-2">
              <div className="relative w-full h-[200px]">
                <Image
                  src={item.image}
                  alt="Blog"
                  fill
                />
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                <p className="text-center bottom-4 line-clamp-1 w-64 mx-auto truncate inset-x-0 font-semibold text-white absolute">
                  {item.title}
                </p>
              </div>
              <p className="text-sm mt-2 line-clamp-4">{item.content}</p>
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
