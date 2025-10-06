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
import { Plus, MapPin, Star, Trash2, Edit, X } from "lucide-react";

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
        setShowAddressForm(false);
        // Reset form
        setFirstName("");
        setLastName("");
        setAddress("");
        setPostalCode("");
        setPhoneNumber("");
        setIsDefaultAddress(false);
        setSelectedRegionName("");
        setSelectedProvinceName("");
        setSelectedMunicipalityName("");
        setSelectedBarangayName("");
        router.refresh();
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
    <div className="space-y-6">
      {/* Add Address Button */}
      {!showAddressForm && (
        <Button
          disabled={loading}
          onClick={() => setShowAddressForm(true)}
          type="button"
          className="w-full sm:w-auto gap-2"
          size="lg"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </Button>
      )}

      {/* Address Form */}
      {showAddressForm && (
        <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Add New Address
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddressForm(false)}
              disabled={loading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
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

            <div className="flex items-center gap-3 pt-4 border-t">
              <Button
                disabled={loading}
                className="flex-1"
                onClick={() => setShowAddressForm(false)}
                variant="outline"
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={loading} className="flex-1" type="submit">
                Save Address
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {!showAddressForm && user?.address && user.address.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Saved Addresses ({user.address.length})
          </h3>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            {user.address.map((address) => (
              <div
                key={address.id}
                className={`relative bg-white rounded-lg border-2 p-5 hover:shadow-md transition-all ${
                  address.isDefault
                    ? "border-green-500 bg-green-50/50"
                    : "border-gray-200"
                }`}
              >
                {address.isDefault && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                      <Star className="w-3 h-3 fill-white" />
                      Default
                    </span>
                  </div>
                )}

                <div className="space-y-2 mb-4 mt-2">
                  <p className="font-semibold text-gray-900 text-lg">
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {address.homeAddress}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.barangay}, {address.city}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.province}, {address.region}
                  </p>
                  <p className="text-sm text-gray-600">{address.zipCode}</p>
                  <p className="text-sm font-medium text-gray-900 pt-1">
                    {address.contactNumber}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t">
                  <Button
                    onClick={() =>
                      router.push(`/my-profile/addresses/${address.id}`)
                    }
                    className="flex-1 gap-2"
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  <Button
                    className="flex-1 gap-2"
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!showAddressForm && (!user?.address || user.address.length === 0) && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Addresses Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Add your first delivery address to get started.
          </p>
          <Button onClick={() => setShowAddressForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Your First Address
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddressForm;
