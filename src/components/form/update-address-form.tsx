"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Address } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAddressData } from "@/lib/address-selection";
import { toast } from "sonner";
import { updateAddress } from "@/actions/user";
import { useRouter } from "next/navigation";

const UpdateAddressForm = ({ data }: { data: Address | null }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [firstName, setFirstName] = React.useState(data?.firstName || "");
  const [lastName, setLastName] = React.useState(data?.lastName || "");
  const [address, setAddress] = React.useState(data?.homeAddress || "");
  const [postalCode, setPostalCode] = React.useState(data?.zipCode || "");
  const [phoneNumber, setPhoneNumber] = React.useState(
    data?.contactNumber || ""
  );
  const [isDefaultAddress, setIsDefaultAddress] = React.useState(
    data?.isDefault || false
  );
  const [selectedRegionName, setSelectedRegionName] = React.useState(
    data?.region || ""
  );
  const [selectedProvinceName, setSelectedProvinceName] = React.useState(
    data?.province || ""
  );
  const [selectedMunicipalityName, setSelectedMunicipalityName] =
    React.useState(data?.city || "");
  const [selectedBarangayName, setSelectedBarangayName] = React.useState(
    data?.barangay || ""
  );
  const {
    regionOptions,
    provinceOptions,
    municipalityOptions,
    barangayOptions,
  } = useAddressData(
    selectedRegionName,
    selectedProvinceName,
    selectedMunicipalityName
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateAddress(data?.id as string, {
        firstName,
        lastName,
        address,
        postalCode,
        phoneNumber,
        isDefaultAddress,
        region: selectedRegionName,
        province: selectedProvinceName,
        municipality: selectedMunicipalityName,
        barangay: selectedBarangayName,
		userId: data?.userId as string,
      });

      if (res.success) {
        toast.success(res.success);
        router.push(`/my-profile/addresses`);
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later.");
    }
  };
  return (
    <>
      <div className="my-5">
        <p className="font-semibold">Update address</p>
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          className="mt-4 space-y-4"
        >
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
            <Input
              disabled={loading}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              type="text"
              required
            />
            <Input
              disabled={loading}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              type="text"
              required
            />
          </div>
          <Textarea
            disabled={loading}
            placeholder="Complete address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border border-zinc-200"
            required
          />
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
            <Select
              disabled={loading}
              onValueChange={(value) => setSelectedRegionName(value)}
              defaultValue={selectedRegionName}
            >
              <SelectTrigger className="border border-zinc-200">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regionOptions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              disabled={loading}
              onValueChange={(value) => setSelectedProvinceName(value)}
              defaultValue={selectedProvinceName}
            >
              <SelectTrigger className="border border-zinc-200">
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {provinceOptions.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
            <Select
              disabled={loading}
              onValueChange={(value) => setSelectedMunicipalityName(value)}
              defaultValue={selectedMunicipalityName}
            >
              <SelectTrigger className="border border-zinc-200">
                <SelectValue placeholder="Select municipality" />
              </SelectTrigger>
              <SelectContent>
                {municipalityOptions.map((municipality) => (
                  <SelectItem key={municipality} value={municipality}>
                    {municipality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              disabled={loading}
              onValueChange={(value) => setSelectedBarangayName(value)}
              defaultValue={selectedBarangayName}
            >
              <SelectTrigger className="border border-zinc-200">
                <SelectValue placeholder="Select barangay" />
              </SelectTrigger>
              <SelectContent>
                {barangayOptions.map((barangay) => (
                  <SelectItem key={barangay} value={barangay}>
                    {barangay}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            disabled={loading}
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            type="text"
            placeholder="Postal/Zip code"
            required
          />
          <Input
            disabled={loading}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone number"
            type="tel"
            required
          />
          <div className="flex items-center space-x-2 mt-3">
            <Checkbox
              disabled={loading}
              defaultChecked={isDefaultAddress}
              onCheckedChange={(value) => setIsDefaultAddress(value === true)}
              id="defaultAddress"
            />
            <label
              htmlFor="defaultAddress"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Set as default address
            </label>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Button
              disabled={loading}
              className="w-full"
              onClick={() => router.push("/my-profile/addresses")}
              variant="secondary"
              type="button"
            >
              Cancel
            </Button>
            <Button disabled={loading} className="w-full">
              Update Address
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateAddressForm;
