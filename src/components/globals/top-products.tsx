"use client";

import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define the shape of a product item
type TopProduct = {
  product: string;
  sales: number;
  fill: string; // color
};

// Props type
type TopProductsProps = {
  topProducts: TopProduct[];
};

export async function TopProducts({ topProducts }: TopProductsProps) {
  const chartConfig = topProducts.reduce((acc, item) => {
    acc[item.product] = { label: item.product, color: item.fill };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Top 10 Products</CardTitle>
        <CardDescription>
          Top products by number of sales in the last month
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={topProducts}
              dataKey="sales"
              nameKey="product"
              stroke="0"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
