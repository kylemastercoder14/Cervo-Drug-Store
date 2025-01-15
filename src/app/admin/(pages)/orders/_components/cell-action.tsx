"use client";

import { Button } from "@/components/ui/button";
import { OrdersColumn } from "./column";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface CellActionProps {
  data: OrdersColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  return (
    <>
      <Button size="sm" onClick={() => router.push(`/admin/orders/${data.id}`)}>
        <FileText className='w-4 h-4 mr-2' />
        View Order
      </Button>
    </>
  );
};
