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
  IconSettings,
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
            <div className="flex items-center gap-2 xl:gap-3 xl:mr-10 cursor-pointer">
              <IconUser color="black" size={26} />
              <div className="xl:flex flex-col hidden">
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
            <DropdownMenuItem
              onClick={() => router.push("/my-profile/account-settings")}
            >
              <IconSettings size={20} color="black" />
              <span className="ml-2">Account Settings</span>
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
            <div className="flex items-center gap-2 xl:gap-3 xl:mr-14 cursor-pointer">
              <IconUser color="black" size={26} />
              <div className="xl:flex flex-col hidden">
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
