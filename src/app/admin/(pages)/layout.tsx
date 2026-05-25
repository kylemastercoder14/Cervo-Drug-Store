import React from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { getUserFromCookies } from "@/hooks/use-user";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user } = await getUserFromCookies();
  if (!user) redirect("/admin/auth/sign-in");
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" admin={user} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-14"
            />
            <h1 className="text-base font-medium">
              Welcome back, {user.name}! 👋
            </h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
