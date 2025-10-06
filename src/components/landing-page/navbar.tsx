"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import UserDropdown from "./user-dropdown";
import CartSheet from "./cart-sheet";
import NavLinks from "./nav-links";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import SearchComponent from "./search-component";
import { searchProducts } from "@/actions/product";

const Navbar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm) {
        const data = await searchProducts(searchTerm);
        setFilteredProducts(data?.data || []);
      } else {
        setFilteredProducts([]);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  return (
    <header className="sticky top-0 z-50 inset-x-0 w-full bg-white">
      <div className="flex items-center border-b border-zinc-300 px-4 gap-10 py-6 lg:px-60 lg:justify-between justify-center">
        <div className="flex items-center gap-5">
          {/* <Sheet>
            <SheetTrigger asChild>
              <Button className="lg:hidden block" size="sm" variant="ghost">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <NavLinks />
            </SheetContent>
          </Sheet> */}

          <Link href="/">
            <Image src="/images/logo.png" alt="Logo" width={180} height={180} />
          </Link>
          <SearchComponent
            onSearch={handleSearch}
            filteredProducts={filteredProducts}
          />
        </div>
        <div className="flex lg:gap-0 gap-2 items-center">
          <Link href="/products" className="mr-5">
            <Button>Browse Products &rarr;</Button>
          </Link>
          <UserDropdown />
          <CartSheet />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
