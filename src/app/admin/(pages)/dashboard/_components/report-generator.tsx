"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetOrders } from "@/data/orders";
import { format } from "date-fns";
import { formatPrice } from "@/lib/utils";
import { useGetBranches } from "@/data/branch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ReportOrder = {
  id: string;
  orderNumber: string;
  email: string;
  totalAmount: number;
  status: string;
  method: string;
  branch: string | null;
  createdAt: Date;
  user?: {
    firstName: string;
    lastName: string;
  } | null;
};

const DashboardReport: React.FC = () => {
  const { data: ordersData, isLoading } = useGetOrders();
  const { data: branchData, isLoading: isLoadingBranches } = useGetBranches();
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [branch, setBranch] = useState<string>("all");

  const filteredOrders = useMemo(() => {
    const orders = (ordersData?.data ?? []) as ReportOrder[];
    const hasBranchFilter = branch !== "all";
    if (!from && !to && !hasBranchFilter) return orders;

    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    return orders.filter((order) => {
      const created = new Date(order.createdAt);
      if (fromDate && created < fromDate) return false;
      if (toDate) {
        const endOfDay = new Date(toDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (created > endOfDay) return false;
      }
      if (hasBranchFilter && order.branch !== branch) return false;
      return true;
    });
  }, [ordersData, from, to, branch]);

  const handlePrint = () => {
    if (!filteredOrders.length) {
      window.alert("No data to print for the selected filters.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const rowsHtml = filteredOrders
      .map((order, index: number) => {
        const created = format(new Date(order.createdAt), "yyyy-MM-dd");
        const customerName = `${order.user?.firstName ?? ""} ${
          order.user?.lastName ?? ""
        }`.trim();
        return `<tr>
          <td style="padding:4px 8px;border:1px solid #ccc;">${index + 1}</td>
          <td style="padding:4px 8px;border:1px solid #ccc;">${
            order.orderNumber
          }</td>
          <td style="padding:4px 8px;border:1px solid #ccc;">${created}</td>
          <td style="padding:4px 8px;border:1px solid #ccc;">${customerName}</td>
          <td style="padding:4px 8px;border:1px solid #ccc;">${
            order.email ?? ""
          }</td>
          <td style="padding:4px 8px;border:1px solid #ccc;">${
            order.branch ?? ""
          }</td>
          <td style="padding:4px 8px;border:1px solid #ccc;text-align:right;">${formatPrice(
            order.totalAmount ?? 0
          )}</td>
          <td style="padding:4px 8px;border:1px solid #ccc;">${
            order.status ?? ""
          }</td>
          <td style="padding:4px 8px;border:1px solid #ccc;">${
            order.method ?? ""
          }</td>
        </tr>`;
      })
      .join("");

    const fromLabel = from || "All";
    const toLabel = to || "All";
    const branchLabel = branch === "all" ? "All" : branch;

    printWindow.document.write(`
      <html>
        <head>
          <title>Orders Report</title>
          <style>
            body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 24px; }
            h1 { font-size: 20px; margin-bottom: 4px; }
            p { font-size: 12px; margin-top: 0; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
            th { background:#f3f3f3; text-align:left; padding:6px 8px; border:1px solid #ccc; }
          </style>
        </head>
        <body>
          <h1>Cervo Drug Store - Orders Report</h1>
          <p>Date Range: ${fromLabel} to ${toLabel}</p>
          <p>Branch: ${branchLabel}</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Order No.</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Branch</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-base md:text-lg">
          Generate Orders Report
        </CardTitle>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">From</span>
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="h-9 w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">To</span>
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="h-9 w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Branch</span>
            <Select
              value={branch}
              onValueChange={setBranch}
              disabled={isLoadingBranches}
            >
              <SelectTrigger className="h-9 w-52">
                <SelectValue placeholder="All branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All branches</SelectItem>
                {branchData?.data?.map((item) => (
                  <SelectItem key={item.id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => {
                setFrom("");
                setTo("");
                setBranch("all");
              }}
            >
              Clear
            </Button>
            <Button
              size="sm"
              type="button"
              onClick={handlePrint}
              disabled={isLoading || !filteredOrders.length}
            >
              Print Report
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          Select filters and click <span className="font-semibold">Print Report</span>{" "}
          to generate a printable table of orders.
        </p>
      </CardContent>
    </Card>
  );
};

export default DashboardReport;

