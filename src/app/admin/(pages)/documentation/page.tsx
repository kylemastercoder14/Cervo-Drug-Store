"use client";
import React, { useState, useEffect } from "react";
import { Heading } from "@/components/ui/heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IconCategory,
  IconDashboard,
  IconDiscount,
  IconFolders,
  IconLogs,
  IconMedicineSyrup,
  IconPhoto,
  IconUser,
  IconUsersGroup,
  IconWallet,
  IconBlockquote,
} from "@tabler/icons-react";
import Image from "next/image";

const navigationItems = [
  { id: "introduction", title: "Introduction", icon: null },
  { id: "dashboard", title: "Dashboard", icon: IconDashboard },
  { id: "categories", title: "Categories", icon: IconCategory },
  { id: "products", title: "Products", icon: IconMedicineSyrup },
  { id: "banners", title: "Banners", icon: IconPhoto },
  { id: "promotions", title: "Promotions", icon: IconDiscount },
  { id: "customers", title: "Customers", icon: IconUser },
  { id: "orders", title: "Orders", icon: IconWallet },
  { id: "inventory", title: "Inventory", icon: IconFolders },
  { id: "news-events", title: "News & Events", icon: IconBlockquote },
  { id: "manage-staff", title: "Manage Staff", icon: IconUsersGroup },
  { id: "logs", title: "Logs", icon: IconLogs },
  { id: "tips", title: "Tips & Best Practices", icon: null },
];

const AdminDocumentation = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;

      const sections = navigationItems.map((item) => item.id);
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolling]);

  const scrollToSection = (id: string) => {
    setIsScrolling(true);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveSection(id);
      setTimeout(() => setIsScrolling(false), 1000);
    }
  };

  return (
    <div className="flex gap-6 px-2 py-5">
      {/* Main Content */}
      <div className="flex-1 max-w-7xl">
        <Heading
          title="Admin Documentation & User Manual"
          description="Complete guide to managing your pharmacy system"
        />

        <div className="mt-6 space-y-6">
          {/* Introduction */}
          <section id="introduction" className="scroll-mt-24">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to the Admin Panel</CardTitle>
                <CardDescription>
                  This comprehensive guide will help you navigate and use all
                  features of the admin system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Getting Started</h3>
                  <p className="text-sm text-muted-foreground">
                    To access the admin panel, you must first log in using your
                    administrator credentials. Once logged in, you'll be
                    redirected to the Dashboard where you can see an overview of
                    your pharmacy's key metrics.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Navigation</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the sidebar menu on the left to navigate between
                    different sections of the admin panel. Each section allows
                    you to manage specific aspects of your pharmacy system.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Dashboard */}
          <section id="dashboard" className="scroll-mt-24">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconDashboard className="w-6 h-6" />
                  <CardTitle>Dashboard</CardTitle>
                </div>
                <CardDescription>
                  Overview of your pharmacy's performance and statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Screenshot/GIF Section */}
                <div className="border-2 border-dashed relative border-gray-300 rounded-lg p-8 bg-gray-50 flex w-full flex-col items-center justify-center min-h-[600px]">
                  {/* Placeholder for image/gif */}
                  <Image
                    src="/documentation/dashboard.gif"
                    alt="Dashboard Overview"
                    fill
                    className="rounded-lg shadow-lg"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">What You Can See</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>
                      <strong>Total Revenue:</strong> Your pharmacy's total
                      revenue with trend indicators
                    </li>
                    <li>
                      <strong>Total Products Sold:</strong> Number of products
                      sold with growth percentage
                    </li>
                    <li>
                      <strong>Active Customers:</strong> Count of active
                      customers in your system
                    </li>
                    <li>
                      <strong>Growth Rate:</strong> Overall business growth
                      metrics
                    </li>
                    <li>
                      <strong>Sales Chart:</strong> Visual representation of
                      sales over time
                    </li>
                    <li>
                      <strong>Recent Transactions:</strong> Latest orders and
                      purchases
                    </li>
                    <li>
                      <strong>Top Products:</strong> Best-selling products
                      ranked by sales
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Actions Available</h3>
                  <p className="text-sm text-muted-foreground">
                    The Dashboard is a read-only view that displays real-time
                    statistics and analytics. You cannot create, update, or
                    delete items from this page. Use other sections to manage
                    your data.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Categories */}
          <section id="categories" className="scroll-mt-24">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconCategory className="w-6 h-6" />
                  <CardTitle>Categories</CardTitle>
                </div>
                <CardDescription>
                  Organize your products into categories for better management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Screenshot/GIF Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 relative bg-gray-50 flex flex-col items-center justify-center min-h-[600px] w-full">
                  <Image
                    src="/documentation/categories.gif"
                    alt="Categories Overview"
                    fill
                    className="rounded-lg shadow-lg"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">
                    How to Create a Category
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Navigate to the <strong>Categories</strong> page from the
                      sidebar
                    </li>
                    <li>
                      Click the <strong>"Add Category"</strong> button at the
                      top right of the page
                    </li>
                    <li>
                      Fill in the category form with the required information:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Category name</li>
                        <li>Description (optional)</li>
                        <li>Category image (optional)</li>
                      </ul>
                    </li>
                    <li>
                      Click <strong>"Save"</strong> to create the category
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    How to Update a Category
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Go to the <strong>Categories</strong> page
                    </li>
                    <li>Find the category you want to update in the table</li>
                    <li>
                      Click the three-dot menu (⋯) button in the{" "}
                      <strong>Actions</strong> column
                    </li>
                    <li>
                      Select <strong>"Update"</strong> from the dropdown menu
                    </li>
                    <li>Modify the category information in the form</li>
                    <li>
                      Click <strong>"Save"</strong> to apply the changes
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    How to Delete a Category
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Go to the <strong>Categories</strong> page
                    </li>
                    <li>Find the category you want to delete in the table</li>
                    <li>
                      Click the three-dot menu (⋯) button in the{" "}
                      <strong>Actions</strong> column
                    </li>
                    <li>
                      Select <strong>"Delete"</strong> from the dropdown menu
                    </li>
                    <li>Confirm the deletion in the confirmation dialog</li>
                    <li className="text-red-600">
                      <strong>Warning:</strong> Make sure no products are using
                      this category before deleting
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Products */}
          <section id="products" className="scroll-mt-24">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconMedicineSyrup className="w-6 h-6" />
                  <CardTitle>Products</CardTitle>
                </div>
                <CardDescription>
                  Manage your pharmacy's product catalog
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Screenshot/GIF Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 relative bg-gray-50 flex flex-col items-center justify-center min-h-[600px] w-full">
                  <Image
                    src="/documentation/products.gif"
                    alt="Products Overview"
                    fill
                    className="rounded-lg shadow-lg"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">
                    How to Create a Product
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Navigate to the <strong>Products</strong> page from the
                      sidebar
                    </li>
                    <li>
                      Click the <strong>"Add Product"</strong> button at the top
                      right
                    </li>
                    <li>
                      Fill in the product form with the required information:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Product name</li>
                        <li>Description</li>
                        <li>Category (select from existing categories)</li>
                        <li>Price</li>
                        <li>Stock quantity</li>
                        <li>Product images</li>
                        <li>Additional details as required</li>
                      </ul>
                    </li>
                    <li>
                      Click <strong>"Save"</strong> to create the product
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    How to Update a Product
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Go to the <strong>Products</strong> page
                    </li>
                    <li>Find the product you want to update in the table</li>
                    <li>
                      Click the three-dot menu (⋯) button in the{" "}
                      <strong>Actions</strong> column
                    </li>
                    <li>
                      Select <strong>"Update"</strong> from the dropdown menu
                    </li>
                    <li>Modify the product information in the form</li>
                    <li>
                      Click <strong>"Save"</strong> to apply the changes
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    How to Delete a Product
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Go to the <strong>Products</strong> page
                    </li>
                    <li>Find the product you want to delete in the table</li>
                    <li>
                      Click the three-dot menu (⋯) button in the{" "}
                      <strong>Actions</strong> column
                    </li>
                    <li>
                      Select <strong>"Delete"</strong> from the dropdown menu
                    </li>
                    <li>Confirm the deletion in the confirmation dialog</li>
                    <li className="text-red-600">
                      <strong>Warning:</strong> Deleting a product will remove
                      it from your catalog and may affect existing orders
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Search and Filter</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the search bar at the top of the products table to
                    quickly find products by name. You can also sort columns by
                    clicking on the column headers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Banners */}
          <section id="banners" className="scroll-mt-24">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconPhoto className="w-6 h-6" />
                  <CardTitle>Banners</CardTitle>
                </div>
                <CardDescription>
                  Manage promotional banners displayed on your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Screenshot/GIF Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 relative bg-gray-50 flex flex-col items-center justify-center min-h-[600px] w-full">
                  <Image
                    src="/documentation/banners.gif"
                    alt="Banners Overview"
                    fill
                    className="rounded-lg shadow-lg"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">How to Create a Banner</h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Navigate to the <strong>Banner</strong> page from the
                      sidebar
                    </li>
                    <li>
                      Click the <strong>"Add Banner"</strong> button at the top
                      right
                    </li>
                    <li>
                      Fill in the banner form:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Banner title</li>
                        <li>Banner image (upload a high-quality image)</li>
                        <li>
                          Link URL (optional - where clicking the banner should
                          lead)
                        </li>
                        <li>Display order/priority</li>
                        <li>Active status (enable/disable banner)</li>
                      </ul>
                    </li>
                    <li>
                      Click <strong>"Save"</strong> to create the banner
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">How to Update a Banner</h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Go to the <strong>Banner</strong> page
                    </li>
                    <li>Find the banner you want to update in the table</li>
                    <li>
                      Click the three-dot menu (⋯) button in the{" "}
                      <strong>Actions</strong> column
                    </li>
                    <li>
                      Select <strong>"Update"</strong> from the dropdown menu
                    </li>
                    <li>Modify the banner information in the form</li>
                    <li>
                      Click <strong>"Save"</strong> to apply the changes
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">How to Delete a Banner</h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Go to the <strong>Banner</strong> page
                    </li>
                    <li>Find the banner you want to delete in the table</li>
                    <li>
                      Click the three-dot menu (⋯) button in the{" "}
                      <strong>Actions</strong> column
                    </li>
                    <li>
                      Select <strong>"Delete"</strong> from the dropdown menu
                    </li>
                    <li>Confirm the deletion in the confirmation dialog</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Promotions */}
          <section id="promotions" className="scroll-mt-24">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconDiscount className="w-6 h-6" />
                  <CardTitle>Promotions</CardTitle>
                </div>
                <CardDescription>
                  Create and manage promotional offers and discounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Screenshot/GIF Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 relative bg-gray-50 flex flex-col items-center justify-center min-h-[600px] w-full">
                  <Image
                    src="/documentation/promotions.gif"
                    alt="Promotions Overview"
                    fill
                    className="rounded-lg shadow-lg"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">
                    How to Create a Promotion
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Navigate to the <strong>Promotions</strong> page from the
                      sidebar
                    </li>
                    <li>
                      Click the <strong>"Add Promotion"</strong> button at the
                      top right
                    </li>
                    <li>
                      Fill in the promotion form:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Promotion title</li>
                        <li>Description</li>
                        <li>Discount percentage or amount</li>
                        <li>Start date and end date</li>
                        <li>Promotion image</li>
                        <li>Products/categories included (if applicable)</li>
                        <li>Active status</li>
                      </ul>
                    </li>
                    <li>
                      Click <strong>"Save"</strong> to create the promotion
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    How to Update a Promotion
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Go to the <strong>Promotions</strong> page
                    </li>
                    <li>Find the promotion you want to update in the table</li>
                    <li>
                      Click the three-dot menu (⋯) button in the{" "}
                      <strong>Actions</strong> column
                    </li>
                    <li>
                      Select <strong>"Update"</strong> from the dropdown menu
                    </li>
                    <li>Modify the promotion information in the form</li>
                    <li>
                      Click <strong>"Save"</strong> to apply the changes
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    How to Delete a Promotion
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Go to the <strong>Promotions</strong> page
                    </li>
                    <li>Find the promotion you want to delete in the table</li>
                    <li>
                      Click the three-dot menu (⋯) button in the{" "}
                      <strong>Actions</strong> column
                    </li>
                    <li>
                      Select <strong>"Delete"</strong> from the dropdown menu
                    </li>
                    <li>Confirm the deletion in the confirmation dialog</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Customers */}
          <section id="customers" className="scroll-mt-24">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconUser className="w-6 h-6" />
                  <CardTitle>Customers</CardTitle>
                </div>
                <CardDescription>
                  View and manage customer information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Screenshot/GIF Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 relative bg-gray-50 flex flex-col items-center justify-center min-h-[600px] w-full">
                  <Image
                    src="/documentation/customers.gif"
                    alt="Customers Overview"
                    fill
                    className="rounded-lg shadow-lg"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Viewing Customers</h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Navigate to the <strong>Customers</strong> page from the
                      sidebar
                    </li>
                    <li>
                      You will see a table listing all registered customers
                    </li>
                    <li>
                      Each row shows customer information including:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Customer name</li>
                        <li>Email address</li>
                        <li>Contact number</li>
                        <li>Registration date</li>
                        <li>Customer type (Regular, Senior Citizen, PWD)</li>
                      </ul>
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    Viewing Customer Details
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Go to the <strong>Customers</strong> page
                    </li>
                    <li>Find the customer you want to view in the table</li>
                    <li>
                      Click on the customer row or the{" "}
                      <strong>"View Details"</strong> button
                    </li>
                    <li>
                      You will see detailed information including:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Personal information (name, user type)</li>
                        <li>Contact details (email, phone)</li>
                        <li>Delivery address</li>
                        <li>
                          Senior Citizen/PWD ID information (if applicable)
                        </li>
                        <li>ID images (if uploaded)</li>
                      </ul>
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Searching Customers</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the search bar at the top of the customers table to
                    quickly find customers by name or email. You can also sort
                    columns by clicking on the column headers.
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Customer information is typically
                    read-only for security and privacy reasons. Customers manage
                    their own profiles through the customer-facing website.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Orders */}
          <section id="orders" className="scroll-mt-24">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconWallet className="w-6 h-6" />
                  <CardTitle>Orders</CardTitle>
                </div>
                <CardDescription>
                  Track and manage customer orders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Screenshot/GIF Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 relative bg-gray-50 flex flex-col items-center justify-center min-h-[600px] w-full">
                  <Image
                    src="/documentation/orders.gif"
                    alt="Orders Overview"
                    fill
                    className="rounded-lg shadow-lg"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Viewing Orders</h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Navigate to the <strong>Orders</strong> page from the
                      sidebar
                    </li>
                    <li>
                      You will see a table listing all orders with:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Order number</li>
                        <li>Total amount</li>
                        <li>Discount price (if any)</li>
                        <li>Delivery fee</li>
                        <li>
                          Order status (Pending, Processing, Completed,
                          Cancelled)
                        </li>
                        <li>Order option (Delivery or Installation)</li>
                        <li>Date created</li>
                      </ul>
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Viewing Order Details</h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Go to the <strong>Orders</strong> page
                    </li>
                    <li>Find the order you want to view in the table</li>
                    <li>
                      Click the <strong>"View Order"</strong> button in the
                      Actions column
                    </li>
                    <li>
                      You will see detailed information including:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Customer information</li>
                        <li>Shipping address</li>
                        <li>Order items with quantities and prices</li>
                        <li>Order status and tracking timeline</li>
                        <li>Payment details</li>
                        <li>Order summary with totals</li>
                      </ul>
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    How to Update Order Status
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>Open the order details page (click "View Order")</li>
                    <li>
                      Locate the order status dropdown near the top of the page
                    </li>
                    <li>
                      Select the new status from the dropdown:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>
                          <strong>PENDING:</strong> Order received, awaiting
                          processing
                        </li>
                        <li>
                          <strong>PROCESSING:</strong> Order is being prepared
                        </li>
                        <li>
                          <strong>SHIPPED:</strong> Order has been shipped (for
                          delivery orders)
                        </li>
                        <li>
                          <strong>COMPLETED:</strong> Order has been
                          delivered/installed
                        </li>
                        <li>
                          <strong>CANCELLED:</strong> Order has been cancelled
                        </li>
                      </ul>
                    </li>
                    <li>
                      The status will update automatically when you select a new
                      status
                    </li>
                    <li>
                      The order tracking timeline will update to reflect the new
                      status
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    Understanding Order Status
                  </h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      <strong>Pending (Yellow):</strong> New orders waiting to
                      be processed
                    </li>
                    <li>
                      <strong>Processing (Blue):</strong> Orders currently being
                      prepared
                    </li>
                    <li>
                      <strong>Completed (Green):</strong> Successfully
                      delivered/fulfilled orders
                    </li>
                    <li>
                      <strong>Cancelled (Red):</strong> Orders that have been
                      cancelled
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Searching Orders</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the search bar at the top of the orders table to quickly
                    find orders by order number. You can also sort columns by
                    clicking on the column headers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Inventory */}
          <section id="inventory" className="scroll-mt-24">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconFolders className="w-6 h-6" />
                  <CardTitle>Inventory</CardTitle>
                </div>
                <CardDescription>
                  Manage your pharmacy's inventory items and stock levels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Screenshot/GIF Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 relative bg-gray-50 flex flex-col items-center justify-center min-h-[600px] w-full">
                  <Image
                    src="/documentation/inventory.gif"
                    alt="Inventory Overview"
                    fill
                    className="rounded-lg shadow-lg"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">
                    How to Create an Inventory Item
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Navigate to the <strong>Inventory</strong> page from the
                      sidebar
                    </li>
                    <li>
                      Click the <strong>"Add Inventory"</strong> button at the
                      top right
                    </li>
                    <li>
                      Fill in the inventory form:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Item name</li>
                        <li>Description</li>
                        <li>Current stock quantity</li>
                        <li>Minimum stock level (reorder point)</li>
                        <li>Unit of measurement</li>
                        <li>Category or type</li>
                        <li>Supplier information (optional)</li>
                      </ul>
                    </li>
                    <li>
                      Click <strong>"Save"</strong> to create the inventory item
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    How to Update Inventory
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Go to the <strong>Inventory</strong> page
                    </li>
                    <li>
                      Find the inventory item you want to update in the table
                    </li>
                    <li>
                      Click the three-dot menu (⋯) button in the{" "}
                      <strong>Actions</strong> column
                    </li>
                    <li>
                      Select <strong>"Update"</strong> from the dropdown menu
                    </li>
                    <li>
                      Modify the inventory information, including stock
                      quantities
                    </li>
                    <li>
                      Click <strong>"Save"</strong> to apply the changes
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    How to Delete an Inventory Item
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Go to the <strong>Inventory</strong> page
                    </li>
                    <li>
                      Find the inventory item you want to delete in the table
                    </li>
                    <li>
                      Click the three-dot menu (⋯) button in the{" "}
                      <strong>Actions</strong> column
                    </li>
                    <li>
                      Select <strong>"Delete"</strong> from the dropdown menu
                    </li>
                    <li>Confirm the deletion in the confirmation dialog</li>
                    <li className="text-red-600">
                      <strong>Warning:</strong> Make sure to update related
                      products before deleting inventory items
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Stock Management Tips</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Regularly update stock levels when receiving new inventory
                    </li>
                    <li>
                      Set appropriate minimum stock levels to avoid running out
                    </li>
                    <li>Monitor low stock items regularly</li>
                    <li>
                      Keep inventory records accurate for better decision-making
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* News and Events */}
          <section id="news-events" className="scroll-mt-24">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconBlockquote className="w-6 h-6" />
                  <CardTitle>News & Events</CardTitle>
                </div>
                <CardDescription>
                  Create and manage news articles and events for your customers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Screenshot/GIF Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 relative bg-gray-50 flex flex-col items-center justify-center min-h-[600px] w-full">
                  <Image
                    src="/documentation/news.gif"
                    alt="News Overview"
                    fill
                    className="rounded-lg shadow-lg"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">
                    How to Create News or Event
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Navigate to the <strong>News & Events</strong> page from
                      the sidebar
                    </li>
                    <li>
                      Click the <strong>"Add News/Event"</strong> button at the
                      top right
                    </li>
                    <li>
                      Fill in the form:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Title</li>
                        <li>Content/Description (use rich text editor)</li>
                        <li>Featured image</li>
                        <li>Event date (for events)</li>
                        <li>Start date and end date</li>
                        <li>Category (News or Event)</li>
                        <li>Published status</li>
                      </ul>
                    </li>
                    <li>
                      Click <strong>"Save"</strong> to create the news/event
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    How to Update News or Event
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Go to the <strong>News & Events</strong> page
                    </li>
                    <li>Find the item you want to update in the table</li>
                    <li>
                      Click the three-dot menu (⋯) button in the{" "}
                      <strong>Actions</strong> column
                    </li>
                    <li>
                      Select <strong>"Update"</strong> from the dropdown menu
                    </li>
                    <li>Modify the content in the form</li>
                    <li>
                      Click <strong>"Save"</strong> to apply the changes
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    How to Delete News or Event
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Go to the <strong>News & Events</strong> page
                    </li>
                    <li>Find the item you want to delete in the table</li>
                    <li>
                      Click the three-dot menu (⋯) button in the{" "}
                      <strong>Actions</strong> column
                    </li>
                    <li>
                      Select <strong>"Delete"</strong> from the dropdown menu
                    </li>
                    <li>Confirm the deletion in the confirmation dialog</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Manage Staff */}
          <section id="manage-staff" className="scroll-mt-24">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconUsersGroup className="w-6 h-6" />
                  <CardTitle>Manage Staff</CardTitle>
                </div>
                <CardDescription>
                  Add and manage staff members who can access the admin panel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Screenshot/GIF Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 relative bg-gray-50 flex flex-col items-center justify-center min-h-[600px] w-full">
                  <Image
                    src="/documentation/staff.gif"
                    alt="Staff Overview"
                    fill
                    className="rounded-lg shadow-lg"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">
                    How to Create a Staff Member
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Navigate to the <strong>Staff</strong> page from the
                      sidebar
                    </li>
                    <li>
                      Click the <strong>"Add Staff"</strong> button at the top
                      right
                    </li>
                    <li>
                      Fill in the staff form:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Full name</li>
                        <li>Email address (will be used for login)</li>
                        <li>Password (ensure it's secure)</li>
                        <li>Contact number</li>
                        <li>Role/Permissions</li>
                        <li>Access level</li>
                      </ul>
                    </li>
                    <li>
                      Click <strong>"Save"</strong> to create the staff account
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    How to Update Staff Information
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Go to the <strong>Staff</strong> page
                    </li>
                    <li>
                      Find the staff member you want to update in the table
                    </li>
                    <li>
                      Click the three-dot menu (⋯) button in the{" "}
                      <strong>Actions</strong> column
                    </li>
                    <li>
                      Select <strong>"Update"</strong> from the dropdown menu
                    </li>
                    <li>Modify the staff information in the form</li>
                    <li>
                      Click <strong>"Save"</strong> to apply the changes
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    How to Delete a Staff Member
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Go to the <strong>Staff</strong> page
                    </li>
                    <li>
                      Find the staff member you want to remove in the table
                    </li>
                    <li>
                      Click the three-dot menu (⋯) button in the{" "}
                      <strong>Actions</strong> column
                    </li>
                    <li>
                      Select <strong>"Delete"</strong> from the dropdown menu
                    </li>
                    <li>Confirm the deletion in the confirmation dialog</li>
                    <li className="text-red-600">
                      <strong>Warning:</strong> This will permanently remove the
                      staff member's access to the admin panel
                    </li>
                  </ol>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Security Tip:</strong> Only create staff accounts
                    for trusted employees. Regularly review staff access and
                    remove accounts for former employees immediately.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Logs */}
          <section id="logs" className="scroll-mt-24">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconLogs className="w-6 h-6" />
                  <CardTitle>Logs</CardTitle>
                </div>
                <CardDescription>
                  View system activity logs and audit trails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Screenshot/GIF Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 relative bg-gray-50 flex flex-col items-center justify-center min-h-[600px] w-full">
                  <Image
                    src="/documentation/logs.gif"
                    alt="Logs Overview"
                    fill
                    className="rounded-lg shadow-lg"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Viewing Logs</h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Navigate to the <strong>Logs</strong> page from the
                      sidebar
                    </li>
                    <li>You will see a table listing all system activities</li>
                    <li>
                      Each log entry typically includes:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Action performed (create, update, delete)</li>
                        <li>User who performed the action</li>
                        <li>Item/entity affected</li>
                        <li>Timestamp</li>
                        <li>Additional details</li>
                      </ul>
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Using Logs</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>Review logs to track system changes</li>
                    <li>Use logs for troubleshooting issues</li>
                    <li>Audit trail for security purposes</li>
                    <li>Monitor staff activity</li>
                  </ul>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> The Logs page is read-only. You can
                    view and search logs but cannot create, update, or delete
                    log entries. Logs are automatically generated by the system.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* General Tips */}
          <section id="tips" className="scroll-mt-24">
            <Card>
              <CardHeader>
                <CardTitle>General Tips & Best Practices</CardTitle>
                <CardDescription>
                  Helpful information for using the admin system effectively
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Data Management</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>Always verify information before saving changes</li>
                    <li>
                      Use descriptive names for products, categories, and other
                      items
                    </li>
                    <li>Keep product images clear and professional</li>
                    <li>
                      Regularly update inventory to maintain accurate stock
                      levels
                    </li>
                    <li>Review and update promotions before they expire</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Order Management</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>
                      Update order status promptly to keep customers informed
                    </li>
                    <li>Monitor pending orders daily</li>
                    <li>Process orders in a timely manner</li>
                    <li>Verify customer information before shipping</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Security</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>Never share your admin login credentials</li>
                    <li>Use strong, unique passwords</li>
                    <li>Log out when finished using the admin panel</li>
                    <li>Only grant staff access to trusted employees</li>
                    <li>Review logs regularly for suspicious activity</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Troubleshooting</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>If a page doesn't load, try refreshing the browser</li>
                    <li>
                      Check your internet connection if you experience slow
                      loading
                    </li>
                    <li>
                      Clear your browser cache if you see outdated information
                    </li>
                    <li>
                      Contact your system administrator for technical issues
                    </li>
                    <li>
                      Check the logs page to see what actions were performed
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Contact Support */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Need Help?</CardTitle>
              <CardDescription className="text-blue-700">
                If you need additional assistance or encounter any issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-800">
                For technical support or questions about using the admin system,
                please contact your system administrator or the development
                team. They can provide additional guidance and resolve any
                technical issues you may encounter.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky Navigation Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="bg-card border rounded-lg p-3 shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Table of Contents</h2>
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                      activeSection === item.id
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span className="text-left">{item.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default AdminDocumentation;
