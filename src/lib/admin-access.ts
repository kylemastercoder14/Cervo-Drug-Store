export const isAdminRole = (role?: string | null) =>
  role?.trim().toLowerCase() === "admin";

export const ADMIN_ONLY_ERROR =
  "Admin permission required. Staff accounts have view-only access outside Orders.";
