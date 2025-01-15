import React from "react";
import Chatbot from "@/components/landing-page/chatbot";
import Navbar from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getUserByEmail } from "@/actions/user";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from '../../../lib/utils';

const MyProfile = async () => {
  const { userId } = auth();
  const user = await db.user.findUnique({
    where: {
      id: userId as string,
    },
    include: {
      address: true,
      orders: { include: { OrderItems: { include: { product: true } } } },
    },
  });

  return (
    <div className="flex relative min-h-screen w-full flex-col">
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
              <BreadcrumbPage className="text-[16px]">Account</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-semibold text-4xl mb-5">My Account</h1>
        <div className="grid md:grid-cols-5 grid-cols-1 gap-20 mt-5">
          <div className="col-span-3">
            <h2>Order History</h2>
            {user?.orders && user.orders.length > 0 ? (
              user.orders.map((order) => (
                <div
                  className="flex flex-col border-b pb-3 mt-3"
                  key={order.id}
                >
                  <div className="flex items-center justify-between">
                    <p>Order Number: {order.orderNumber}</p>
                    <p className={`font-semibold ${order.status === "Pending" ? "text-black" : "text-emerald-600"}`}>{order.status === "Pending" ? "Order Placed" : "Order Completed"}</p>
                  </div>
                  <div className="flex flex-col space-y-3 mt-3">
                    {order.OrderItems.map((orderItem) => (
                      <div key={orderItem.id} className="flex bg-white shadow border rounded-md p-2 gap-3 items-start">
                        <Image
                          width={70}
                          height={70}
                          src={orderItem.product.image}
                          alt={orderItem.product.name}
                        />
                        <div>
                          <p className='font-semibold'>{orderItem.product.name}</p>
                          <p className='text-muted-foreground'>{orderItem.product.categoryTag}</p>
                          <p className='text-sm'>{orderItem.quantity} {orderItem.quantity > 2 ? "items" : "item"}</p>
                        </div>
                      </div>
                    ))}
                    <p>{order.OrderItems.length} {order.OrderItems.length > 2 ? "items" : "item"}: <span className='font-semibold'>{formatPrice(order.totalAmount)}</span></p>
                  </div>
                </div>
              ))
            ) : (
              <p>You haven't placed any orders yet.</p>
            )}
          </div>
          <div className="col-span-2">
            <h2>Account Details</h2>
            {user?.address &&
              user.address.filter((address) => address.isDefault).length >
                0 && (
                <div>
                  {user.address
                    .filter((address) => address.isDefault)
                    .map((defaultAddress) => (
                      <div key={defaultAddress.id}>
                        <p>
                          {defaultAddress.firstName} {defaultAddress.lastName}
                        </p>
                        <p>
                          {defaultAddress.homeAddress},{" "}
                          {defaultAddress.barangay}
                        </p>
                        <p>
                          {defaultAddress.city}, {defaultAddress.province}
                        </p>
                        <p>
                          {defaultAddress.region} - {defaultAddress.zipCode}
                        </p>
                        <p>{defaultAddress.contactNumber}</p>
                      </div>
                    ))}
                </div>
              )}
            <Link href="/my-profile/addresses">
              <Button className="mt-3">
                View Addresses ({user?.address.length})
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyProfile;
