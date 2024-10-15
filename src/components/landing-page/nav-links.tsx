"use client";

import { getCategoriesNavbar } from "@/actions/category";
import { Categories } from "@prisma/client";
import { IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const NavLinks = () => {
  const [items, setItems] = useState<Categories[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const response = await getCategoriesNavbar();
      if (response && response.data) {
        setItems(response.data);
      } else {
        return null;
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const subItems = [
    { name: "Specialty Medicines", href: "/specialty-medicines" },
    { name: "Track Your Order", href: "/track-order" },
    { name: "FAQs", href: "/faqs" },
    { name: "Blogs & Announcements", href: "/blogs-announcements" },
  ];

  if (loading) return <BarLoader loading color="#437634" />;

  return (
    <div className="flex xl:flex-row flex-col xl:mt-0 mt-20 xl:items-center items-start xl:px-0 px-10 gap-10">
      {items.map((item) => (
        <Link
          key={item.id}
          className="flex items-center font-semibold gap-2"
          href="#"
        >
          <span>{item.name}</span>
          <IconChevronDown color="black" size={14} />
        </Link>
      ))}
      {subItems.map((item, index) => (
        <Link
          key={index}
          className="flex items-center gap-2 font-semibold"
          href={item.href}
        >
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;
