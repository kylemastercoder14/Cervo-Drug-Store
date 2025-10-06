"use server";

import db from "@/lib/db";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";

function getPeriodRange(monthsAgo: number) {
  const start = startOfMonth(subMonths(new Date(), monthsAgo));
  const end = endOfMonth(subMonths(new Date(), monthsAgo));
  return { start, end };
}

export async function getRevenueStats() {
  const { start: thisStart, end: thisEnd } = getPeriodRange(0);
  const { start: prevStart, end: prevEnd } = getPeriodRange(1);

  const [thisMonth, lastMonth] = await Promise.all([
    db.orders.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: "COMPLETED",
        createdAt: { gte: thisStart, lte: thisEnd },
      },
    }),
    db.orders.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: "COMPLETED",
        createdAt: { gte: prevStart, lt: prevEnd },
      },
    }),
  ]);

  return {
    current: thisMonth._sum.totalAmount ?? 0,
    previous: lastMonth._sum.totalAmount ?? 0,
  };
}

export async function getProductsStats() {
  const { start: thisStart, end: thisEnd } = getPeriodRange(0);
  const { start: prevStart, end: prevEnd } = getPeriodRange(1);

  const [thisMonth, lastMonth] = await Promise.all([
    db.orderItems.aggregate({
      _sum: { quantity: true },
      where: { createdAt: { gte: thisStart, lte: thisEnd } },
    }),
    db.orderItems.aggregate({
      _sum: { quantity: true },
      where: { createdAt: { gte: prevStart, lte: prevEnd } },
    }),
  ]);

  return {
    current: thisMonth._sum.quantity ?? 0,
    previous: lastMonth._sum.quantity ?? 0,
  };
}

export async function getCustomerStats() {
  const { start: thisStart, end: thisEnd } = getPeriodRange(0);
  const { start: prevStart, end: prevEnd } = getPeriodRange(1);

  const [thisMonth, lastMonth] = await Promise.all([
    db.orders.findMany({
      where: { createdAt: { gte: thisStart, lte: thisEnd } },
      select: { userId: true },
    }),
    db.orders.findMany({
      where: { createdAt: { gte: prevStart, lte: prevEnd } },
      select: { userId: true },
    }),
  ]);

  const distinctThis = new Set(thisMonth.map((o) => o.userId)).size;
  const distinctPrev = new Set(lastMonth.map((o) => o.userId)).size;

  return { current: distinctThis, previous: distinctPrev };
}

export async function getGrowthStats() {
  const { start: thisStart, end: thisEnd } = getPeriodRange(0);
  const { start: prevStart, end: prevEnd } = getPeriodRange(1);

  const [thisMonth, lastMonth] = await Promise.all([
    db.orders.count({
      where: {
        status: "COMPLETED",
        createdAt: { gte: thisStart, lte: thisEnd },
      },
    }),
    db.orders.count({
      where: {
        status: "COMPLETED",
        createdAt: { gte: prevStart, lte: prevEnd },
      },
    }),
  ]);

  return { current: thisMonth, previous: lastMonth };
}

export async function getSalesData() {
  // group orders by createdAt (day) and status
  const sales = await db.orders.groupBy({
    by: ["status", "createdAt"],
    _sum: { totalAmount: true },
  });

  // collect unique dates (from createdAt)
  const dates = Array.from(
    new Set(sales.map((s) => s.createdAt.toISOString().split("T")[0]))
  );

  // build chart dataset
  return dates.map((date) => {
    const completed = sales.find(
      (s) =>
        s.createdAt.toISOString().split("T")[0] === date &&
        s.status === "COMPLETED"
    );
    const cancelled = sales.find(
      (s) =>
        s.createdAt.toISOString().split("T")[0] === date &&
        s.status === "CANCELLED"
    );

    return {
      date,
      sales: completed?._sum?.totalAmount ?? 0,
      loss: cancelled?._sum?.totalAmount ?? 0,
    };
  });
}

export async function getRecentTransactions() {
  return db.orders.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getTopProducts() {
  const products = await db.orderItems.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 10,
  });

  // Fetch product names + map with quantity
  const productDetails = await db.products.findMany({
    where: {
      id: { in: products.map((p) => p.productId) },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return products.map((p, index) => {
    const product = productDetails.find((d) => d.id === p.productId);
    return {
      product: product?.name ?? "Unknown",
      sales: p._sum.quantity ?? 0,
      fill: chartColors[index % chartColors.length], // assign a color
    };
  });
}

// pick 10 distinct colors
const chartColors = [
  "#F54927",
  "#5DBB63",
  "#F5E027",
  "#2746F5",
  "#F527E4",
  "#27F5DA",
  "#9B59B6",
  "#1ABC9C",
  "#E67E22",
  "#2ECC71",
];
