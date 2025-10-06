import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Orders } from "@prisma/client";
import { Badge } from '@/components/ui/badge';

const RecentTransaction = ({ transactions }: { transactions: Orders[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          Showing your last {transactions.length} orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table className='max-h-[300px] overflow-y-auto'>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.orderNumber}>
                <TableCell className="font-medium">{tx.orderNumber}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      tx.status === "PENDING"
                        ? "bg-yellow-500/20 text-yellow-700 border-yellow-500"
                        : tx.status === "PROCESSING"
                        ? "bg-blue-500/20 text-blue-700 border-blue-500"
                        : tx.status === "COMPLETED"
                        ? "bg-green-500/20 text-green-700 border-green-500"
                        : tx.status === "CANCELLED"
                        ? "bg-red-500/20 text-red-700 border-red-500"
                        : ""
                    }
                  >
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell>{tx.branch ?? "N/A"}</TableCell>
                <TableCell className="text-right">
                  ₱
                  {tx.totalAmount.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentTransaction;
