"use client";

import Chatbot from "@/components/landing-page/chatbot";
import Navbar from "@/components/landing-page/navbar";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { IconTrashXFilled } from "@tabler/icons-react";
import Footer from "@/components/landing-page/footer";
import Image from "next/image";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import useCart from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

const Cart = () => {
  const router = useRouter();
  const { items, updateQuantity, removeItem, removeAll } = useCart();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) =>
      item.discountedPrice === 0
        ? total + item.price * item.quantity
        : total + item.discountedPrice * item.quantity,
    0
  );
  return (
    <div className="flex relative min-h-screen w-full flex-col">
      <Chatbot />
      <Navbar />
      <div className="px-4 xl:px-60 py-5 mt-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-[16px]" href="/">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[16px]">
                Your Shopping Cart
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="bg-[#eeeeee] flex justify-between mt-5 items-center rounded-lg py-3 px-5 shadow-md border">
          <p className="font-semibold text-lg">Shopping Cart ({totalItems})</p>
        </div>
        <div className="flex justify-between mt-5 items-center rounded-lg py-3">
          <Table className="border">
            <TableHeader>
              <TableRow className="border border-zinc-400">
                <TableHead className="xl:w-[100px] border-r border-zinc-400"></TableHead>
                <TableHead className="xl:w-[100px] border-r border-zinc-400"></TableHead>
                <TableHead className="border-r border-zinc-400">
                  Product
                </TableHead>
                <TableHead className="border-r border-zinc-400">
                  Price
                </TableHead>
                <TableHead className="border-r border-zinc-400">
                  Quantity
                </TableHead>
                <TableHead className="border-r border-zinc-400">
                  Subtotal
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border border-zinc-400">
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <IconTrashXFilled
                      className="cursor-pointer"
                      onClick={() => removeItem(item.id)}
                      color="red"
                    />
                  </TableCell>
                  <TableCell>
                    <Image
                      src={item.image}
                      alt="Product"
                      width={50}
                      height={50}
                    />
                  </TableCell>
                  <TableCell className="flex flex-col">
                    <p className="font-semibold">{item.name}</p>
                    <p className="font-semibold text-sm text-muted-foreground">
                      {item.category}
                    </p>
                  </TableCell>
                  <TableCell>{item.discountedPrice === 0
                      ? formatPrice(item.price)
                      : formatPrice(item.discountedPrice)}</TableCell>
                  <TableCell>
                    <div className="flex items-center border w-40 bg-white py-2.5 px-5 gap-5">
                      <MinusIcon
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity > 1 ? item.quantity - 1 : 1
                          )
                        }
                        className="cursor-pointer"
                        color="gray"
                      />
                      <input
                        type="text"
                        value={item.quantity}
                        className="border-none bg-white outline-none text-center w-10"
                      />
                      <PlusIcon
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="cursor-pointer"
                        color="gray"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.discountedPrice === 0
                      ? formatPrice(item.price * item.quantity)
                      : formatPrice(item.discountedPrice * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="border border-zinc-400">
              <TableRow>
                <TableCell colSpan={5}>

                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Button
                    onClick={removeAll}
                    variant="destructive"
                    className="w-full"
                  >
                    Remove All Cart
                  </Button>
                  <Button
                    onClick={() => router.push("/collections/all")}
                    variant="primary"
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <div className="flex justify-between mt-2 xl:w-[30%] w-full items-center rounded-lg py-3">
          <Table className="border">
            <TableBody className="border border-zinc-400">
              <TableRow className="border border-zinc-400">
                <TableCell className="font-semibold">Subtotal</TableCell>
                <TableCell>{formatPrice(totalPrice)}</TableCell>
              </TableRow>
              <TableRow className="border border-zinc-400">
                <TableCell className="text-[#437634] font-semibold">
                  Total
                </TableCell>
                <TableCell className="text-[#437634] font-semibold">
                  {formatPrice(totalPrice)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <Button
          onClick={() => router.push("/checkout")}
          variant="primary"
          disabled={items.length === 0}
        >
          Proceed To Checkout
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
