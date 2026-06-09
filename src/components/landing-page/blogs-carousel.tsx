"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { News } from "@prisma/client";
import { toast } from "sonner";
import { getAllNewsEvents } from "@/actions/news-events";

const BlogsCarousel = () => {
  const [blogs, setBlogs] = useState<News[]>([]);
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
    <div className="w-full">
      <div className="mb-3 flex justify-end">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#437634] transition-colors hover:text-[#2f5524]"
        >
          View all blogs
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <Carousel className="w-full">
        <CarouselContent className="-ml-2">
          {blogs.map((item, index) => (
            <CarouselItem key={index} className="pl-2 md:basis-1/3">
              <div className="p-2">
                <div className="relative w-full h-[200px]">
                  {item.videoUrl ? (
                    <video
                      src={item.videoUrl}
                      poster={item.image}
                      controls
                      preload="metadata"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Image src={item.image} alt="Blog" fill className="object-contain" />
                  )}
                  <div className="pointer-events-none absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                  <Link
                    href={`/blogs/${item.id}`}
                    className="text-center bottom-4 line-clamp-1 w-64 mx-auto truncate inset-x-0 font-semibold text-white absolute"
                  >
                    {item.title}
                  </Link>
                </div>
                <div
                  className="mt-2 line-clamp-4 text-sm leading-6 text-slate-800 [&_a]:text-[#437634] [&_blockquote]:border-l-4 [&_blockquote]:border-[#437634] [&_blockquote]:pl-3 [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-2 [&_strong]:font-semibold [&_ul]:ml-5 [&_ul]:list-disc"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
                <Link
                  href={`/blogs/${item.id}`}
                  className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#437634] hover:text-[#2f5524]"
                >
                  Read more
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default BlogsCarousel;
