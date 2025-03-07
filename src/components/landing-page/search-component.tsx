"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { IconSearch } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const SearchComponent = ({
  onSearch,
  filteredProducts,
}: {
  onSearch: (query: string) => void;
  filteredProducts: any[];
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = () => {
    onSearch(searchTerm.trim());
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    onSearch(value.trim());
  };

  return (
    <div className="relative flex items-center gap-3">
      <Input
        placeholder="Search Products..."
        type="search"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="w-[200px] xl:w-[500px]"
      />
      <Button onClick={handleSearch} variant="primary" size="sm">
        <IconSearch color="white" />
      </Button>
      {showDropdown && filteredProducts.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded shadow-lg z-50">
          {filteredProducts.map((product) => {
            const encodedSlug = encodeURIComponent(product.tags);
            const productUrl = `/products/${encodedSlug}`;
            return (
              <div
              key={product.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSearchTerm(product.name);
                setShowDropdown(false);
                router.push(productUrl);
              }}
            >
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">{product.category?.name}</p>
            </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
