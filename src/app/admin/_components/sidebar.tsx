import {
  IconCategory,
  IconFolders,
  IconHelp,
  IconMedicineSyrup,
  IconNews,
  IconPhoto,
  IconPhotoScan,
  IconReceipt,
  IconSettings,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import React from "react";
import MenuLink from "./menu-link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  {
    title: "Main",
    list: [
      {
        title: "Banners",
        path: "/admin/banners",
        icon: <IconPhoto />,
      },
      {
        title: "Promotions",
        path: "/admin/promotions",
        icon: <IconPhotoScan />,
      },
      {
        title: "Categories",
        path: "/admin/categories",
        icon: <IconCategory />,
      },
      {
        title: "Products",
        path: "/admin/products",
        icon: <IconMedicineSyrup />,
      },
      {
        title: "Customers",
        path: "/admin/customers",
        icon: <IconUsers />,
      },
    ],
  },
  {
    title: "Others",
    list: [
      {
        title: "Orders",
        path: "/admin/orders",
        icon: <IconReceipt />,
      },
      {
        title: "Inventory",
        path: "/admin/inventory",
        icon: <IconFolders />,
      },
      {
        title: "Articles",
        path: "/admin/articles",
        icon: <IconNews />,
      },
      {
        title: "Staff",
        path: "/admin/staff",
        icon: <IconUsersGroup />,
      },
      {
        title: "Settings",
        path: "/admin/settings",
        icon: <IconSettings />,
      },
      {
        title: "Contact Support",
        path: "/admin/support",
        icon: <IconHelp />,
      },
    ],
  },
];

const Sidebar = () => {
  return (
    <div className="fixed w-[350px] top-[40px]">
      <div className="flex items-center gap-5 mb-5">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>KL</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold">Admin Name</span>
          <span className="text-xs text-muted-foreground">Administrator</span>
        </div>
      </div>
      <ul className="list-none ml-0">
        {menuItems.map((item) => (
          <li key={item.title}>
            <span className="text-muted-foreground font-semibold text-sm my-2">
              {item.title}
            </span>
            {item.list.map((subItem) => (
              <MenuLink key={subItem.title} item={subItem} />
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
