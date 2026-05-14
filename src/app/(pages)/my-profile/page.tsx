import React from "react";
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
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Package, MapPin, User } from "lucide-react";

const getStatusLabel = (status: string) => {
  switch (status) {
    case "AWAITING_SHIPPING_FEE_CONFIRMATION":
      return "To Confirm";
    case "SHIPPING_FEE_REJECTED":
      return "Fee Rejected";
    default:
      return status;
  }
};

const MyProfile = async () => {
  const { userId } = auth();
  const user = await db.user.findUnique({
    where: {
      id: userId as string,
    },
    include: {
      address: true,
      orders: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          totalAmount: true,
          discountPrice: true,
          deliveryFee: true,
          orderOption: true,
          status: true,
          OrderItems: {
            select: {
              id: true,
              quantity: true,
              product: {
                select: {
                  name: true,
                  categoryTag: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="flex relative min-h-screen w-full flex-col bg-gray-50">
      <Navbar />
      <div className="px-4 xl:px-60 py-8 mt-5">
        <Breadcrumb className="mb-6">
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

        <h1 className="font-bold text-3xl mb-8 text-gray-900">My Account</h1>

        <div className="grid lg:grid-cols-3 grid-cols-1 gap-8">
          {/* Order History Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-gray-700" />
                <h2 className="text-2xl font-semibold text-gray-900">
                  Order History
                </h2>
              </div>

              {user?.orders && user.orders.length > 0 ? (
                <div className="space-y-6">
                  {user.orders.map((order) => (
                    <div
                      className="border rounded-lg p-5 bg-gray-50 hover:shadow-md transition-shadow"
                      key={order.id}
                    >
                      <div className="flex items-center justify-between mb-4 pb-3 border-b">
                        <div>
                          <p className="text-sm text-gray-500">Order Number</p>
                          <p className="font-semibold text-gray-900">
                            {order.orderNumber}
                          </p>
                        </div>
                        <span
                          className={`px-4 py-1.5 capitalize rounded-sm text-sm font-medium ${
                            order.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status ===
                                "AWAITING_SHIPPING_FEE_CONFIRMATION"
                              ? "bg-amber-100 text-amber-700"
                              : order.status === "SHIPPING_FEE_REJECTED"
                              ? "bg-red-100 text-red-700"
                              : order.status === "PROCESSING"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "SHIPPED"
                              ? "bg-violet-100 text-violet-700"
                              : order.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : order.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        {order.OrderItems.map((orderItem) => (
                          <div
                            key={orderItem.id}
                            className="flex bg-white rounded-md p-3 gap-3 items-start border"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {orderItem.product.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {orderItem.product.categoryTag}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                Quantity: {orderItem.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(
                              order.totalAmount -
                                (order.discountPrice ?? 0) +
                                (order.deliveryFee ?? 0)
                            )}
                          </p>
                          {order.orderOption !== "Pick-Up" &&
                            (!order.deliveryFee || order.deliveryFee === 0) && (
                              <p className="text-xs text-amber-700">
                                Shipping fee to be confirmed
                              </p>
                            )}
                          <p className="text-xs text-gray-500">
                            {order.OrderItems.length}{" "}
                            {order.OrderItems.length > 1 ? "items" : "item"}
                          </p>
                        </div>
                        <Link href={`/track-order/${order.id}`}>
                          <Button disabled={order.status === "CANCELLED"} variant="default" size="sm">
                            Track Order →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    You haven&apos;t placed any orders yet.
                  </p>
                  <Link href="/">
                    <Button className="mt-4">Start Shopping</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Account Details Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-32">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-gray-700" />
                <h2 className="text-2xl font-semibold text-gray-900">
                  Account Details
                </h2>
              </div>

              {user?.address &&
              user.address.filter((address) => address.isDefault).length > 0 ? (
                <div className="mb-6">
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <p className="text-sm font-medium text-gray-700">
                      Default Address
                    </p>
                  </div>
                  {user.address
                    .filter((address) => address.isDefault)
                    .map((defaultAddress) => (
                      <div
                        key={defaultAddress.id}
                        className="bg-gray-50 rounded-lg p-4 space-y-1"
                      >
                        <p className="font-semibold text-gray-900">
                          {defaultAddress.firstName} {defaultAddress.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {defaultAddress.homeAddress}
                        </p>
                        <p className="text-sm text-gray-600">
                          {defaultAddress.barangay}
                        </p>
                        <p className="text-sm text-gray-600">
                          {defaultAddress.city}, {defaultAddress.province}
                        </p>
                        <p className="text-sm text-gray-600">
                          {defaultAddress.region} {defaultAddress.zipCode}
                        </p>
                        <p className="text-sm text-gray-900 font-medium mt-2">
                          {defaultAddress.contactNumber}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="mb-6 text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No default address set
                  </p>
                </div>
              )}

              <Link href="/my-profile/addresses" className="block">
                <Button className="w-full" variant="outline">
                  Manage Addresses ({user?.address.length || 0})
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyProfile;
