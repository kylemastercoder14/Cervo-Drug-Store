"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { IconHeart } from "@tabler/icons-react";
import { Categories, Products } from "@prisma/client";
import { getFeaturedProducts } from "@/actions/product";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import useCart from "@/hooks/use-cart";

interface ProductWithCategory extends Products {
  category: Categories | null;
}

const FeaturedProducts = () => {
  const [items, setItems] = useState<ProductWithCategory[]>([]);
  const addToCart = useCart((state) => state.addItem);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getFeaturedProducts();
      if (!response.error) {
        if (response?.data) {
          setItems(response.data);
        }
      } else {
        console.error(response.error);
      }
    };
    fetchProducts();
  }, []);

  // Function to calculate discount percentage
  const calculateDiscountPercentage = (
    price: number,
    discountedPrice: number | null
  ) => {
    if (discountedPrice === null || price === 0) return null;
    const discount = ((price - discountedPrice) / price) * 100;
    return Math.round(discount); // Round the discount percentage
  };

  // Corrected handleAddToCart function to add specific item to the cart
  const handleAddToCart = (item: ProductWithCategory) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      isPrescriptionRequired: item.isPrescriptionRequired,
      discountedPrice: item.discountedPrice ?? item.price,
      quantity: 1,
      category: item?.category?.name as string,
      image: item.image,
      description: item.description,
    });
  };

  return (
    <div className="grid xl:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5">
      {items.map((item) => {
        const discountPercentage = calculateDiscountPercentage(
          item.price,
          item.discountedPrice
        );
        return (
          <div className="pt-5" key={item.id}>
            <div
              onClick={() => router.push(`/products/${item.tags}`)}
              className="bg-white cursor-pointer shadow-lg relative w-full h-[300px]"
            >
              <Image
                src={item.image}
                alt="Featured"
                fill
                className="w-full h-full"
              />
              {discountPercentage !== null &&
                item?.discountedPrice !== null &&
                item.discountedPrice > 0 && (
                  <div className="absolute top-3 flex items-start gap-1 left-2 px-2.5 py-4 rounded-full bg-[#437634]">
                    <p className="text-white font-black text-xl">
                      {discountPercentage}
                    </p>
                    <div className="flex gap-0 mt-1 flex-col">
                      <p className="m-0 text-[9px] text-white">%</p>
                      <p className="m-0 text-[9px] font-semibold text-white">
                        OFF
                      </p>
                    </div>
                  </div>
                )}
            </div>
            <p className="mt-3 font-semibold">{item.name}</p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <p className="font-semibold">{formatPrice(item.price)}</p>
              {item.discountedPrice !== null && item.discountedPrice !== 0 && (
                <p className="text-muted-foreground line-through">
                  {formatPrice(item.discountedPrice)}
                </p>
              )}
            </div>
            <div className="flex items-center mt-2">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => handleAddToCart(item)}
              >
                Add To Cart
              </Button>
              <Button variant="ghost" size="icon" className="w-14 p-0">
                <IconHeart color="#437634" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturedProducts;
