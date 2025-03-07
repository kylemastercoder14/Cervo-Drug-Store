import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  IconBlockquote,
  IconCategory,
  IconDiscount,
  IconFolders,
  IconLogs,
  IconMedicineSyrup,
  IconPhoto,
  IconUser,
  IconUsersGroup,
  IconWallet,
} from "@tabler/icons-react";
import Image from "next/image";
import { Admin } from "@prisma/client";
import { getUserFromCookies } from "@/hooks/use-user";
import { redirect } from "next/navigation";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  admin: Admin | null;
}

const data = {
  navMain: [
    {
      title: "Banner",
      url: "/admin/banners",
      icon: IconPhoto,
    },
    {
      title: "Promotions",
      url: "/admin/promotions",
      icon: IconDiscount,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: IconMedicineSyrup,
    },
    {
      title: "Customers",
      url: "/admin/customers",
      icon: IconUser,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: IconWallet,
    },
    {
      title: "Inventory",
      url: "/admin/inventory",
      icon: IconFolders,
    },
    {
      title: "News & Events",
      url: "/admin/news-and-events",
      icon: IconBlockquote,
    },
    {
      title: "Manage Staff",
      url: "/admin/manage-staff",
      icon: IconUsersGroup,
    },
    {
      title: "Logs",
      url: "/admin/logs",
      icon: IconLogs,
    },
  ],
};

export async function AppSidebar({ admin, ...props }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a className="mt-5" href="/teacher/dashboard">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={160}
                  height={160}
                />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser admin={admin} />
      </SidebarFooter>
    </Sidebar>
  );
}
