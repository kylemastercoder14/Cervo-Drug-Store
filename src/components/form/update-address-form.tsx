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
import { Save, X } from "lucide-react";

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form autoComplete="off" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              First Name
            </label>
            <Input
              disabled={loading}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
              type="text"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Last Name
            </label>
            <Input
              disabled={loading}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
              type="text"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Complete Address
          </label>
          <Textarea
            disabled={loading}
            placeholder="House number, street name, building, etc."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            required
          />
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Region
            </label>
            <Select
              disabled={loading}
              onValueChange={(value) => setSelectedRegionName(value)}
              value={selectedRegionName}
            >
              <SelectTrigger className='w-full'>
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
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Province
            </label>
            <Select
              disabled={loading}
              onValueChange={(value) => setSelectedProvinceName(value)}
              value={selectedProvinceName}
            >
              <SelectTrigger className='w-full'>
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
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              City/Municipality
            </label>
            <Select
              disabled={loading}
              onValueChange={(value) => setSelectedMunicipalityName(value)}
              value={selectedMunicipalityName}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Select city/municipality" />
              </SelectTrigger>
              <SelectContent>
                {municipalityOptions.map((municipality) => (
                  <SelectItem key={municipality} value={municipality}>
                    {municipality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Barangay
            </label>
            <Select
              disabled={loading}
              onValueChange={(value) => setSelectedBarangayName(value)}
              value={selectedBarangayName}
            >
              <SelectTrigger className='w-full'>
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
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Postal/Zip Code
            </label>
            <Input
              disabled={loading}
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              type="text"
              placeholder="Enter postal code"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Phone Number
            </label>
            <Input
              disabled={loading}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              type="tel"
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            disabled={loading}
            checked={isDefaultAddress}
            onCheckedChange={(value) => setIsDefaultAddress(value === true)}
            id="defaultAddress"
          />
          <label
            htmlFor="defaultAddress"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Set as default address
          </label>
        </div>

        <div className="flex items-center gap-3 pt-6 border-t">
          <Button
            disabled={loading}
            className="flex-1 gap-2"
            onClick={() => router.push("/my-profile/addresses")}
            variant="outline"
            type="button"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button disabled={loading} className="flex-1 gap-2" type="submit">
            <Save className="w-4 h-4" />
            Update Address
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAddressForm;
