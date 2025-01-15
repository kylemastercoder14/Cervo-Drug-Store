"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Address, Orders, User } from "@prisma/client";
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
import { createAddress } from "@/actions/user";
import { useRouter } from "next/navigation";

interface AddressFormProps extends User {
  address: Address[];
  orders: Orders[];
}

const AddressForm = ({ user }: { user: AddressFormProps | null }) => {
  const router = useRouter();
  const [showAddressForm, setShowAddressForm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [isDefaultAddress, setIsDefaultAddress] = React.useState(false);
  const [selectedRegionName, setSelectedRegionName] = React.useState("");
  const [selectedProvinceName, setSelectedProvinceName] = React.useState("");
  const [selectedMunicipalityName, setSelectedMunicipalityName] =
    React.useState("");
  const [selectedBarangayName, setSelectedBarangayName] = React.useState("");
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
      const res = await createAddress(user?.id as string, {
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
      });

      if (res.success) {
        toast.success(res.success);
        router.refresh();
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
      <Button
        disabled={loading}
        onClick={() => setShowAddressForm(true)}
        type="button"
      >
        Add a new address
      </Button>
      {showAddressForm && (
        <div className="my-5">
          <p className="font-semibold">Add a new address</p>
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
                onClick={() => setShowAddressForm(false)}
                variant="secondary"
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={loading} className="w-full">
                Add Address
              </Button>
            </div>
          </form>
        </div>
      )}
      {!showAddressForm && (
        <div className="grid md:grid-cols-4 w-full grid-cols-1 gap-5 mt-10">
          {user?.address.map((address) => (
            <div
              key={address.id}
              className="flex flex-col text-center items-center justify-center w-full bg-white p-5 rounded-lg border shadow-md"
            >
              <h3>{address.isDefault ? "Default" : ""}</h3>
              <p className="text-muted-foreground mt-3">
                {address.firstName} {address.lastName}
              </p>
              <p className="text-muted-foreground mt-1">
                {address.homeAddress}, {address.barangay}
              </p>
              <p className="text-muted-foreground mt-1">
                {address.zipCode} {address.city}, {address.province}{" "}
                {address.region}
              </p>
              <p className="text-muted-foreground mt-1">
                {address.contactNumber}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Button
                  onClick={() =>
                    router.push(`/my-profile/addresses/${address.id}`)
                  }
                  className="w-full"
                  variant="secondary"
                >
                  Edit
                </Button>
                <Button className="w-full">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AddressForm;
