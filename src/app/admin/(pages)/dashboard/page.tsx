import React from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SalesChart } from "@/components/globals/sales-chart";
import RecentTransaction from "@/components/globals/recent-transaction";
import { TopProducts } from "@/components/globals/top-products";
import {
  getCustomerStats,
  getGrowthStats,
  getProductsStats,
  getRecentTransactions,
  getRevenueStats,
  getSalesData,
  getTopProducts,
} from "@/actions/dashboard";
import { calculateTrend } from "@/lib/utils";
import DashboardReport from "./_components/report-generator";

const AdminDashboard = async () => {
  const revenue = await getRevenueStats();
  const products = await getProductsStats();
  const customers = await getCustomerStats();
  const growths = await getGrowthStats();

  // Use monthly data for trend calculations (month-over-month comparison)
  // but display all-time data in the cards
  const revenueTrend = calculateTrend(
    revenue.monthlyCurrent ?? revenue.current,
    revenue.monthlyPrevious ?? revenue.previous,
    "revenue"
  );
  const productTrend = calculateTrend(
    products.monthlyCurrent ?? products.current,
    products.monthlyPrevious ?? products.previous,
    "products"
  );
  const customerTrend = calculateTrend(
    customers.monthlyCurrent ?? customers.current,
    customers.monthlyPrevious ?? customers.previous,
    "customers"
  );
  const growthTrend = calculateTrend(
    growths.monthlyCurrent ?? growths.current,
    growths.monthlyPrevious ?? growths.previous,
    "growth"
  );

  const salesData = await getSalesData();
  const recentTransactions = await getRecentTransactions();
  const topProducts = await getTopProducts();
  return (
    <div className="py-5">
      <div>
        <DashboardReport />
      </div>
      <div className="grid mt-5 lg:grid-cols-4 grid-cols-1 gap-5">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              ₱
              {revenue.current.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {revenueTrend.trend === "up" ? (
                  <IconTrendingUp className="size-4 mr-1" />
                ) : (
                  <IconTrendingDown className="size-4 mr-1" />
                )}
                {revenueTrend.percent}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {revenueTrend.description}
              {revenueTrend.trend === "up" ? (
                <IconTrendingUp className="size-4" />
              ) : (
                <IconTrendingDown className="size-4" />
              )}
            </div>
            <div className="text-muted-foreground">
              {revenueTrend.recommendation}
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Products Sold</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {products.current}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {productTrend.trend === "up" ? (
                  <IconTrendingUp className="size-4 mr-1" />
                ) : (
                  <IconTrendingDown className="size-4 mr-1" />
                )}
                {productTrend.percent}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {productTrend.description}
              {productTrend.trend === "up" ? (
                <IconTrendingUp className="size-4" />
              ) : (
                <IconTrendingDown className="size-4" />
              )}
            </div>
            <div className="text-muted-foreground">
              {productTrend.recommendation}
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Active Customers</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {customers.current}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {customerTrend.trend === "up" ? (
                  <IconTrendingUp className="size-4 mr-1" />
                ) : (
                  <IconTrendingDown className="size-4 mr-1" />
                )}
                {customerTrend.percent}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {customerTrend.description}
              {customerTrend.trend === "up" ? (
                <IconTrendingUp className="size-4" />
              ) : (
                <IconTrendingDown className="size-4" />
              )}
            </div>
            <div className="text-muted-foreground">
              {customerTrend.recommendation}
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Growth Rate</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {growths.current}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {growthTrend.trend === "up" ? (
                  <IconTrendingUp className="size-4 mr-1" />
                ) : (
                  <IconTrendingDown className="size-4 mr-1" />
                )}
                {growthTrend.percent}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {growthTrend.description}
              {growthTrend.trend === "up" ? (
                <IconTrendingUp className="size-4" />
              ) : (
                <IconTrendingDown className="size-4" />
              )}
            </div>
            <div className="text-muted-foreground">
              {growthTrend.recommendation}
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="mt-5">
        <SalesChart data={salesData} />
      </div>
      <div className="mt-5">
        <div className="grid lg:grid-cols-5 grid-cols-1 gap-5">
          <div className="lg:col-span-3">
            <RecentTransaction transactions={recentTransactions} />
          </div>
          <div className="lg:col-span-2">
            <TopProducts topProducts={topProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
