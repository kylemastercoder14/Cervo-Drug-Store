"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import UserDropdown from "./user-dropdown";
import CartSheet from "./cart-sheet";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import SearchComponent, { type SearchProduct } from "./search-component";
import { searchProducts } from "@/actions/product";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "../ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<SearchProduct[]>([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm) {
        const data = await searchProducts(searchTerm);
        setFilteredProducts(data?.data || []);
      } else {
        setFilteredProducts([]);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  return (
    <header className="sticky top-0 z-50 inset-x-0 w-full bg-white">
      <div className="border-b border-zinc-300 px-3 py-3 sm:px-4 md:px-6 lg:px-8 xl:px-20">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  className="xl:hidden"
                  size="icon"
                  variant="ghost"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 mt-6">
                  <Link href="/" className="text-lg font-semibold hover:text-primary transition-colors">
                    Home
                  </Link>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="laboratory-services">
                      <AccordionTrigger className="text-base font-medium">
                        Laboratory Services
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-3 pl-4">
                          <Link href="/laboratory-services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            All Laboratory Services
                          </Link>
                          <Link href="/laboratory-services/hematology" className="text-sm hover:text-primary transition-colors">
                            Hematology
                          </Link>
                          <Link href="/laboratory-services/clinical-chemistry" className="text-sm hover:text-primary transition-colors">
                            Clinical Chemistry
                          </Link>
                          <Link href="/laboratory-services/serology" className="text-sm hover:text-primary transition-colors">
                            Serology
                          </Link>
                          <Link href="/laboratory-services/microbiology" className="text-sm hover:text-primary transition-colors">
                            Microbiology
                          </Link>
                          <Link href="/laboratory-services/clinical-microscopy" className="text-sm hover:text-primary transition-colors">
                            Clinical Microscopy
                          </Link>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="medical-services">
                      <AccordionTrigger className="text-base font-medium">
                        Medical Services
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-3 pl-4">
                          <Link href="/medical-services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            All Medical Services
                          </Link>
                          <Link href="/medical-services/consultation" className="text-sm hover:text-primary transition-colors">
                            Consultation
                          </Link>
                          <Link href="/medical-services/home-services" className="text-sm hover:text-primary transition-colors">
                            Home Services
                          </Link>
                          <Link href="/medical-services/extraction" className="text-sm hover:text-primary transition-colors">
                            Blood Extraction
                          </Link>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Link href="/careers" className="text-lg font-semibold hover:text-primary transition-colors">
                    Careers
                  </Link>
                  <Link href="/contact-us" className="text-lg font-semibold hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                  <Link href="/products" className="mt-4">
                    <Button className="w-full">Browse Products &rarr;</Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={130}
                height={130}
                className="h-auto w-[110px] sm:w-[130px] xl:w-[150px]"
              />
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link href="/products" className="hidden md:block xl:hidden">
              <Button size="sm" className="px-3 text-xs sm:text-sm">
                Products
              </Button>
            </Link>
            <Link href="/products" className="hidden xl:block">
              <Button size="sm" className="text-sm">
                <span>Browse Products</span>
                <span>&rarr;</span>
              </Button>
            </Link>
            <UserDropdown />
            <CartSheet />
          </div>
        </div>

        <div className="mt-3 md:mt-4 xl:hidden">
          <SearchComponent
            onSearch={handleSearch}
            filteredProducts={filteredProducts}
          />
        </div>

        <div className="hidden xl:mt-4 xl:flex xl:items-center xl:justify-between xl:gap-8">
          <div className="w-full max-w-md">
            <SearchComponent
              onSearch={handleSearch}
              filteredProducts={filteredProducts}
            />
          </div>

          <NavigationMenu className="max-w-none">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Laboratory Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/laboratory-services"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Laboratory Services
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Comprehensive laboratory testing services
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/laboratory-services/hematology" title="Hematology">
                      Complete blood count, blood typing, and coagulation studies
                    </ListItem>
                    <ListItem href="/laboratory-services/clinical-chemistry" title="Clinical Chemistry">
                      Blood glucose, lipid profile, liver function tests, and more
                    </ListItem>
                    <ListItem href="/laboratory-services/serology" title="Serology">
                      Infectious disease testing, antibody screening, and immunology
                    </ListItem>
                    <ListItem href="/laboratory-services/microbiology" title="Microbiology">
                      Culture and sensitivity, bacterial identification
                    </ListItem>
                    <ListItem href="/laboratory-services/clinical-microscopy" title="Clinical Microscopy">
                      Urinalysis, fecalysis, and microscopic examinations
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Medical Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/medical-services"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Medical Services
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Professional medical care and consultation services
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/medical-services/consultation" title="Consultation">
                      General medical consultation and health check-ups
                    </ListItem>
                    <ListItem href="/medical-services/home-services" title="Home Services">
                      Home visit services including blood extraction and health monitoring
                    </ListItem>
                    <ListItem href="/medical-services/extraction" title="Blood Extraction">
                      Professional blood sample collection at home or clinic
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/careers" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  )}>
                    Careers
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact-us" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  )}>
                    Contact Us
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuViewport />
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};

// Reusable ListItem Component for navigation menu
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
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

export default Navbar;
