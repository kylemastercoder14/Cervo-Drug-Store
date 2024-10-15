"use client";

import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import UserDropdown from "./user-dropdown";
import WishlistModal from "./wishlist-modal";
import CartSheet from "./cart-sheet";
import NavLinks from "./nav-links";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const Navbar = () => {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 inset-x-0 w-full bg-white">
      <div className="flex items-center border-b border-zinc-300 px-4 gap-10 py-6 xl:px-60 xl:justify-between justify-center">
        <div className="flex items-center gap-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="xl:hidden block" size="sm" variant="ghost">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <NavLinks />
            </SheetContent>
          </Sheet>

          <Link href="/">
            <Image src="/images/logo.png" alt="Logo" width={180} height={180} />
          </Link>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search Products..."
              type="search"
              className="w-[200px] xl:w-[500px]"
            />
            <Button
              onClick={() =>
                router.push("/collections/anti-diarrhea-medicines")
              }
              variant="primary"
              size="sm"
            >
              <IconSearch color="white" />
            </Button>
          </div>
        </div>
        <div className="flex xl:gap-0 gap-5 items-center">
          <UserDropdown />
          <WishlistModal />
          <CartSheet />
        </div>
      </div>
      <div className="py-5 w-full justify-center xl:flex hidden px-4 bg-[#f5f5f5] shadow-md">
        <NavLinks />
      </div>
    </header>
  );
};

export default Navbar;
