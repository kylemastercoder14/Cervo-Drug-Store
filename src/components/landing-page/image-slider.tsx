"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Banner } from "@prisma/client";
import { getAllBanner } from "@/actions/banner";
import { toast } from "sonner";

const ImageSlider = () => {
  const [imageData, setImageData] = useState<Banner[]>([]);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const fetchBanner = async () => {
      const response = await getAllBanner();
      if (response.data) {
        setImageData(response.data);
      } else {
        toast.error(response.error || "An error occurred");
      }
    };

    fetchBanner();
  }, []);

  const showPrevImage = () => {
    setImageIndex((index) => {
      if (index === 0) return imageData.length - 1;
      return index - 1;
    });
  };

  const showNextImage = () => {
    setImageIndex((index) => {
      if (index === imageData.length - 1) return 0;
      return index + 1;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((index) =>
        index === imageData.length - 1 ? 0 : index + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [imageData.length]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div
        className="w-full lg:h-[550px] rounded-lg h-screen flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(${-imageIndex * 100}%)` }}
      >
        {imageData.map((url, idx) => (
          <div
            key={idx}
            className="w-full rounded-lg h-full flex-shrink-0 relative"
          >
            <Image
              src={url.image}
              alt={`Slider ${idx + 1}`}
              fill
              className="w-full h-full rounded-lg object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 rounded-lg to-transparent" />
          </div>
        ))}
      </div>

      <div className="absolute flex items-center gap-2 bottom-5 left-1/2 transform -translate-x-1/2">
        <button onClick={showPrevImage} className="squish mx-10">
          <IconChevronLeft size={25} color="white" />
        </button>
        {imageData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setImageIndex(idx)}
            className={`${
              imageIndex === idx
                ? "bg-white w-8 h-3 rounded-2xl"
                : "bg-transparent border border-white w-3 h-3 rounded-full mx-1"
            } squish`}
          />
        ))}
        <button onClick={showNextImage} className="squish mx-10">
          <IconChevronRight size={25} color="white" />
        </button>
      </div>
    </div>
  );
};

export default ImageSlider;
