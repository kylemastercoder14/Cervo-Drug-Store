import React from "react";
import db from "@/lib/db";
import Link from "next/link";
import { Button } from "../../../../../components/ui/button";
import { Download } from "lucide-react";
import Image from "next/image";

const CustomerId = async ({
  params,
}: {
  params: {
    customerId: string;
  };
}) => {
  const data = await db.user.findUnique({
    where: {
      id: params.customerId,
    },
    include: {
      address: {
        where: {
          isDefault: true,
        },
      },
    },
  });

  if (!data) {
    return <div>Customer not found</div>;
  }

  // Extract address fields or show "N/A" if all are missing
  const address = data.address[0];
  const formattedAddress =
    address?.homeAddress ||
    address?.barangay ||
    address?.city ||
    address?.province
      ? `${address?.homeAddress || ""}, ${address?.barangay || ""}, ${
          address?.city || ""
        }, ${address?.province || ""}, ${address?.region || ""} - ${
          address?.zipCode || ""
        }`
      : "N/A";

  return (
    <div className="py-5">
      <Link href="/admin/customers" className="hover:underline mb-4">
        &larr; Back to Customers Page
      </Link>
      <h1 className="text-2xl font-bold">Customer Details</h1>
      <div className="mt-5">
        <p>
          <span className="font-semibold">Name:</span> {data.firstName}{" "}
          {data.lastName}
        </p>
        <p>
          <span className="font-semibold">Email Address:</span> {data.email}
        </p>
        <p>
          <span className="font-semibold">Contact Number:</span>{" "}
          {data.contactNumber}
        </p>
        <p>
          <span className="font-semibold">Address:</span> {formattedAddress}
        </p>
        <p>
          <span className="font-semibold">User Type:</span>{" "}
          {data.seniorPwdId ? "Senior Citizen" : "Regular"}
        </p>
        {data.seniorPwdId && data.seniorPwdBookletImage && (
          <>
            <p>
              <span className="font-semibold">Senior Citizen/PWD ID:</span>{" "}
              {data.seniorPwdId}
              <Image
                src={data.seniorPwdIdImage || ""}
                alt="Senior Citizen/PWD ID"
                width={100}
                height={100}
              />
            </p>
            <p>
              <span className="font-semibold">Senior Citizen/PWD Booklet:</span>{" "}
              <Image
                src={data.seniorPwdBookletImage || ""}
                alt="Senior Citizen/PWD Booklet"
                width={100}
                height={100}
              />
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerId;
