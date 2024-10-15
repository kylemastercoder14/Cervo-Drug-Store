/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { IconHeart } from "@tabler/icons-react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "../ui/badge";
import useCart from "@/hooks/use-cart";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";

const ProductsContent = ({
  columns = 1,
  items,
  loading,
}: {
  columns?: number;
  items: any[];
  loading: boolean;
}) => {
  const addToCart = useCart((state) => state.addItem);
  const router = useRouter();

  const calculateDiscountPercentage = (
    price: number,
    discountedPrice: number | null
  ) => {
    if (discountedPrice === null || price === 0) return null;
    const discount = ((price - discountedPrice) / price) * 100;
    return Math.round(discount);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <BarLoader loading color="#437634" />
      </div>
    );

  return (
    <div
      className={`grid gap-5 ${
        columns === 1 ? "grid-cols-1" : `grid-cols-${columns}`
      }`}
    >
      {items.map((item, index) => {
        const discountPercentage = calculateDiscountPercentage(
          item.price,
          item.discountedPrice
        );

        const handleAddToCart = () => {
          addToCart({
            id: item?.id as string,
            name: item?.name as string,
            isPrescriptionRequired: item?.isPrescriptionRequired as boolean,
            price: item?.price ?? 0,
            discountedPrice: item?.discountedPrice ?? 0,
            quantity: 1,
            category: item?.category?.name as string,
            image: item?.image as string,
            description: item?.description as string,
          });
        };

        return columns === 1 ? (
          <div className="pt-5" key={index}>
            <div className="grid gap-3 grid-cols-5 bg-white">
              <div onClick={() => router.push(`/products/${item.tags}`)} className="col-span-2 cursor-pointer relative w-full h-[300px]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="w-full h-full object-contain"
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
              <div className="flex col-span-3 mt-10 flex-col">
                <div className="text-2xl flex items-center gap-2 font-semibold">
                  {item.name} <Badge>{item.category?.name}</Badge>
                </div>
                <div className="flex items-center gap-1 mt-2 text-lg">
                  {item.discountedPrice === 0 ? (
                    <p className="font-semibold line-clamp-2">
                      {item.price !== null ? formatPrice(item.price) : "N/A"}
                    </p>
                  ) : (
                    <p className="font-semibold line-clamp-2">
                      {item.discountedPrice !== null
                        ? formatPrice(item.discountedPrice)
                        : "N/A"}
                    </p>
                  )}
                  {item.discountedPrice !== 0 && (
                    <p className="text-muted-foreground line-through">
                      {formatPrice(item.price)}
                    </p>
                  )}
                </div>
                <div className="flex items-center mt-2">
                  <Button
                    onClick={handleAddToCart}
                    variant="primary"
                    className="w-full"
                  >
                    Add To Cart
                  </Button>
                  <Button variant="ghost" size="icon" className="w-14 p-0">
                    <IconHeart color="#437634" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-5" key={index}>
            <div onClick={() => router.push(`/products/${item.tags}`)} className="bg-white cursor-pointer shadow-lg relative w-full h-[400px]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="w-full h-full object-cover"
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
              {item.discountedPrice === 0 ? (
                <p className="font-semibold line-clamp-2">
                  {item.price !== null ? formatPrice(item.price) : "N/A"}
                </p>
              ) : (
                <p className="font-semibold line-clamp-2">
                  {item.discountedPrice !== null
                    ? formatPrice(item.discountedPrice)
                    : "N/A"}
                </p>
              )}
              {item.discountedPrice !== 0 && (
                <p className="text-muted-foreground line-through">
                  {formatPrice(item.price)}
                </p>
              )}
            </div>
            <div className="flex items-center mt-2">
              <Button
                onClick={handleAddToCart}
                variant="primary"
                className="w-full"
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

export default ProductsContent;
