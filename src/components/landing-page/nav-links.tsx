"use client";

import { getCategoriesNavbar } from "@/actions/category";
import { getProductsByCategory } from "@/actions/product";
import { Categories } from "@prisma/client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { IconChevronDown } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { cn } from "../../lib/utils";
import Image from 'next/image';

const NavLinks = () => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategoriesNavbar();
      if (response?.data) {
        setCategories(response.data);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = async (categoryTag: string) => {
    setSelectedCategory(categoryTag);
    const data = await getProductsByCategory(categoryTag);
    setProducts(data?.data || []);
  };

  if (loading) return <BarLoader loading color="#437634" />;

  return (
    <div className="flex flex-col gap-10">
      {/* Navigation Menu */}
      <NavigationMenu>
        <NavigationMenuList>
          {categories.map((category) => (
            <NavigationMenuItem key={category.id}>
              <NavigationMenuTrigger
                onClick={() => handleCategoryClick(category.tags)}
              >
                {category.name}
              </NavigationMenuTrigger>
              {selectedCategory === category.tags && (
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    {products.length > 0 ? (
                      products.map((product) => (
                        <ListItem
                          key={product.id}
                          href={`/products/${product.tags}`}
                          title={product.name}
                        >
                          <div className="flex items-center gap-2">
                            <Image src={product.image} alt={product.name} width={100} height={100} />
                            <div>
                              <p>₱{product.price.toFixed(2)} -{" "}</p>
                              <p>{product.isPrescriptionRequired
                                ? "Rx"
                                : "Over the Counter"}</p>
                            </div>
                          </div>
                        </ListItem>
                      ))
                    ) : (
                      <p>No products found for this category.</p>
                    )}
                  </ul>
                </NavigationMenuContent>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavLinks;

// Reusable ListItem Component
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
