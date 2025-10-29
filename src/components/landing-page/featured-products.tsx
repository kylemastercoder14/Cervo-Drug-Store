"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconHeart } from "@tabler/icons-react";
import { OrderItems, Products } from "@prisma/client";
import { getFeaturedProducts } from "@/actions/product";
import { extractWeight, formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import useCart from "@/hooks/use-cart";
interface ProductClientProps extends Products {
  orderItems: OrderItems[];
}

const FeaturedProducts = () => {
  const [items, setItems] = useState<ProductClientProps[]>([]);
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

  // Corrected handleAddToCart function to add specific item to the cart
  const handleAddToCart = (item: ProductClientProps) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      isPrescriptionRequired: item.isPrescriptionRequired,
      isVatable: item.isVatItem,
      quantity: 1,
      tags: item.tags as string,
      image: item.image as string,
      description: item.description as string,
    });
  };

  return (
    <div className="grid xl:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5">
      {items.map((item) => {
        return (
          <div key={item.id}>
            <div
              onClick={() => router.push(`/products/${item.id}`)}
              className="cursor-pointer"
            >
              <div className="relative flex items-center flex-col justify-center bg-primary/40 w-full h-[30vh]">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={80}
                  height={80}
                  className="absolute top-5 right-5"
                />
                <div className="border-4 w-[80%] overflow-hidden text-black text-center font-semibold truncate border-black p-3">
                  {item.name}
                </div>
                <p className="text-black text-center font-semibold mt-3">
                  {extractWeight(item.name) || ""}
                </p>
                {item.isPrescriptionRequired && (
                  <Image
                    src="/images/rx.png"
                    alt="Rx"
                    width={80}
                    height={80}
                    className="absolute bottom-5 right-5"
                  />
                )}
              </div>
            </div>
            <div className="p-3">
              <h1 className="font-semibold line-clamp-1 text-lg">
                {item.isPrescriptionRequired ? "Rx:" : ""} {item.name}
              </h1>
              <p className="text-base font-semibold">
                ₱{item.price.toFixed(2)}
              </p>
              <div className="flex items-center mt-2">
                <Button
                  className="w-full"
                  onClick={() => handleAddToCart(item)}
                >
                  Add To Cart
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturedProducts;
