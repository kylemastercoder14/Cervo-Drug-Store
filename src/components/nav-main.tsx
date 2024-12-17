/* eslint-disable @typescript-eslint/no-explicit-any */
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { IconProps as TablerIconProps } from "@tabler/icons-react";

import {
  Collapsible,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { usePathname } from "next/navigation";

// Update the type of `icon` to accept both Tabler and Lucide Icons
export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: ForwardRefExoticComponent<TablerIconProps & RefAttributes<any>>;
    isActive?: boolean;
    items?: { title: string; url: string }[];
  }[];
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>General</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          (item.items?.length ?? 0) > 0 ? (
            // Render DropdownMenu if there are sub-items
            <DropdownMenu key={item.title}>
              <SidebarMenuItem>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href="#">
                      <item.icon size={20} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="bottom"
                  align="end"
                  className="min-w-56 rounded-lg"
                >
                  {item.items?.map((subItem) => (
                    <DropdownMenuItem asChild key={subItem.title}>
                      <a href={subItem.url}>{subItem.title}</a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </SidebarMenuItem>
            </DropdownMenu>
          ) : (
            // Render Collapsible if there are no sub-items
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
              <SidebarMenuItem>
                <SidebarMenuButton className={pathname === item.url ? "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground" : ""} asChild tooltip={item.title}>
                  <a href={item.url}>
                    <item.icon size={20} />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Collapsible>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
