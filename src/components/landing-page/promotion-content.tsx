"use client";

import { getFeaturedPromotion } from "@/actions/promotion";
import { Promotions } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
      {promotions.map((item) => (
        <div key={item.id} className="relative w-full h-[500px]">
          <Image
            src={item.image}
            alt={item.image}
            fill
            className="w-full h-full rounded-xl object-cover shadow-md"
          />
        </div>
      ))}
    </div>
  );
};

export default PromotionContent;
