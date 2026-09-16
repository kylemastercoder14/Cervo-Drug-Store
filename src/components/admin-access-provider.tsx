"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { isAdminRole } from "@/lib/admin-access";

const AdminAccessContext = React.createContext({ isAdmin: false });

export function AdminAccessProvider({
  role,
  children,
}: {
  role?: string | null;
  children: React.ReactNode;
}) {
  return (
    <AdminAccessContext.Provider value={{ isAdmin: isAdminRole(role) }}>
      {children}
    </AdminAccessContext.Provider>
  );
}

export function useAdminAccess() {
  const { isAdmin } = React.useContext(AdminAccessContext);
  const pathname = usePathname();
  const isOrdersPage =
    pathname === "/admin/orders" || pathname.startsWith("/admin/orders/");

  return {
    isAdmin,
    isReadOnly: !isAdmin && !isOrdersPage,
    canManage: isAdmin || isOrdersPage,
  };
}

export function AdminOnly({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAdminAccess();
  return isAdmin ? <>{children}</> : null;
}
