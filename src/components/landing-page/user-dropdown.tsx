"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconLockFilled,
  IconLogout,
  IconUser,
  IconUserFilled,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";

const UserDropdown = () => {
  const { user } = useUser();
  const router = useRouter();
  const { signOut } = useClerk();
  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 lg:mr-14 mr-0 cursor-pointer">
              <IconUser color="black" size={30} />
              <div className="lg:flex flex-col hidden">
                <p className="text-muted-foreground text-xs">
                  Hello, {user.firstName}!
                </p>
                <p className="font-semibold">My Account & List</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(user ? "/my-profile" : "my-account")}
            >
              <IconLockFilled size={20} color="black" />
              <span className="ml-2">My Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut({ redirectUrl: "/" })}>
              <IconLogout size={20} color="black" />
              <span className="ml-2">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 mr-14 cursor-pointer">
              <IconUser color="black" size={30} />
              <div className="flex flex-col">
                <p className="text-muted-foreground text-xs">
                  Hello, Get Started!
                </p>
                <p className="font-semibold">Sign In or Create Account</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/my-account")}>
              <IconLockFilled size={20} color="black" />
              <span className="ml-2">Sign In</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/my-account")}>
              <IconUserFilled size={20} color="black" />
              <span className="ml-2">Create Account</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default UserDropdown;
