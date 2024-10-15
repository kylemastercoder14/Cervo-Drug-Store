/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IconShoppingBag } from "@tabler/icons-react";
import { Button } from "../ui/button";
import Link from "next/link";
import useCart from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { MinusIcon, PlusIcon, Trash } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

const CartSheet = () => {
  const { user } = useUser();
  const router = useRouter();
  const { items, updateQuantity, removeItem } = useCart();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => item.discountedPrice === 0 ? total + item.price * item.quantity : total + item.discountedPrice * item.quantity,
    0
  );

  // State to track if terms checkbox is checked
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setIsTermsAccepted(checked);
  };

  const handleCheckout = () => {
    if (isTermsAccepted) {
      router.push("/checkout");
    } else {
      toast.error("Please accept the terms and conditions before proceeding.");
    }
  };

  return (
    <Sheet>
      <SheetTrigger>
        <div className="flex items-center gap-3">
          <IconShoppingBag size={30} color="black" />
          <div className="flex flex-col items-start justify-start">
            <p className="font-semibold">Cart Items ({totalItems})</p>
            <p className="text-sm text-muted-foreground">
              {formatPrice(totalPrice)}
            </p>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-white">
            Cart Items ({totalItems})
          </SheetTitle>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex flex-col p-6 mt-40 items-center justify-center">
            <p className="text-3xl font-semibold text-center">
              Your cart is empty
            </p>
            <Button variant="primary" className="mt-10">
              Continue Shopping
            </Button>
            {!user && (
              <div>
                <p className="text-muted-foreground mt-5">
                  Already have an account?
                </p>
                <p className="font-semibold mt-1">
                  <Link className="underline font-bold" href="/login">
                    Login
                  </Link>{" "}
                  to checkout faster.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[77vh] overflow-auto flex flex-col">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start px-6 py-2 mt-10 justify-between gap-10 w-full"
              >
                <div className="flex items-start gap-2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold">{item?.name}</p>
                    <p className="font-semibold text-muted-foreground">
                      {item.discountedPrice === 0
                        ? formatPrice(item?.price * item?.quantity)
                        : formatPrice(item?.discountedPrice * item?.quantity)}
                    </p>
                  </div>
                </div>
                <div className="flex items-end gap-2 flex-col">
                  <Button
                    onClick={() => removeItem(item.id)}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center border py-1.5 px-2 gap-2">
                    <MinusIcon
                      className="cursor-pointer"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity > 1 ? item.quantity - 1 : 1
                        )
                      }
                      color="gray"
                      size={10}
                    />
                    <input
                      type="text"
                      value={item.quantity}
                      readOnly
                      className="border-none outline-none text-center w-5"
                    />
                    <PlusIcon
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="cursor-pointer"
                      color="gray"
                      size={10}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="px-6 flex mt-auto items-center justify-between">
          <p className="font-semibold text-muted-foreground text-lg">
            Subtotal ({totalItems})
          </p>
          <p className="text-lg font-semibold">{formatPrice(totalPrice)}</p>
        </div>
        <div className="flex items-center justify-end px-6 my-3 space-x-2">
          <Checkbox id="terms" onCheckedChange={handleCheckboxChange} />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree with the terms and conditions
          </label>
        </div>
        <SheetFooter className="flex items-center gap-2 px-6 mt-5">
          <Button
            onClick={() => router.push("/cart")}
            variant="outline"
            size="sm"
            className="w-full py-6 text-[#437634] border-[#437634] hover:border-[#437634]"
          >
            View Cart
          </Button>
          <Button
            onClick={handleCheckout}
            variant="primary"
            size="sm"
            className="w-full py-6"
          >
            Checkout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
