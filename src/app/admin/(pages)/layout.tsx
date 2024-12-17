"use client";

import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useUser } from "@clerk/nextjs";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  return (
    <SidebarProvider>
      <AppSidebar admin={user} />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
