"use client";

import { getAllBanner } from "@/actions/banner";
import { Banner } from "@prisma/client";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const HERO_HEIGHT = "min-h-[calc(100vh-110px)]";

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
      if (index === 0) {
        return imageData.length - 1;
      }

      return index - 1;
    });
  };

  const showNextImage = () => {
    setImageIndex((index) => {
      if (index === imageData.length - 1) {
        return 0;
      }

      return index + 1;
    });
  };

  useEffect(() => {
    if (imageData.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setImageIndex((index) =>
        index === imageData.length - 1 ? 0 : index + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [imageData.length]);

  if (imageData.length === 0) {
    return (
      <section
        className={`relative isolate w-full overflow-hidden bg-gradient-to-br from-[#f8f2cd] via-white to-[#e5f0e6] ${HERO_HEIGHT}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(67,118,52,0.18),_transparent_38%)]" />
        <div
          className={`relative mx-auto flex w-full max-w-[1600px] items-end px-5 py-10 sm:px-8 lg:px-14 lg:py-16 ${HERO_HEIGHT}`}
        >
          <div className="max-w-6xl">
            <p className="text-xs font-semibold uppercase text-[#437634] sm:text-sm">
              Cervo Drugstore and Medical Clinic
            </p>
            <h1 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl lg:text-6xl">
              Better Care Starts Here.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Explore trusted pharmacy products, medical services, and health
              offers designed to keep care accessible for every family.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative isolate w-full overflow-hidden bg-slate-950 ${HERO_HEIGHT}`}
    >
      {imageData.map((item, idx) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            imageIndex === idx ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Image
            src={item.image}
            alt={`Slider ${idx + 1}`}
            fill
            priority={idx === 0}
            className="object-contain"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>
      ))}

      <div
        className={`relative mx-auto flex w-full max-w-[1600px] items-end px-5 py-10 sm:px-8 lg:px-14 lg:py-16 ${HERO_HEIGHT}`}
      >
        <div className="max-w-3xl text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#dce9d7] sm:text-sm">
            Cervo Drugstore and Medical Clinic
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-black leading-[0.95] sm:text-5xl lg:text-7xl">
            Better Care Starts Here.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
            Explore trusted pharmacy products, medical services, and health
            offers designed to keep care accessible for every family.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              Featured health promotions
            </div>
            <div className="rounded-full border border-white/20 bg-black/20 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
              {imageIndex + 1} / {imageData.length}
            </div>
          </div>
        </div>
      </div>

      {imageData.length > 1 && (
        <>
          <button
            onClick={showPrevImage}
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 sm:left-6"
            aria-label="Previous slide"
          >
            <IconChevronLeft size={26} />
          </button>
          <button
            onClick={showNextImage}
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 sm:right-6"
            aria-label="Next slide"
          >
            <IconChevronRight size={26} />
          </button>
        </>
      )}

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 sm:bottom-8">
        {imageData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setImageIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all ${
              imageIndex === idx
                ? "h-2.5 w-10 rounded-full bg-white"
                : "h-2.5 w-2.5 rounded-full bg-white/45 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default ImageSlider;
