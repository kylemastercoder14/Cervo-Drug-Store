import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CartItem } from "@/hooks/use-cart";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const maskEmail = (email: string) => {
  const [localPart, domain] = email.split("@");
  const maskedLocalPart =
    localPart.length > 3
      ? `${"*".repeat(localPart.length - 3)}${localPart.slice(-3)}`
      : localPart;
  return `${maskedLocalPart}@${domain}`;
};

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "BDT";
    useCompact?: boolean;
  } = {}
) {
  const { currency = "PHP", useCompact = false } = options;

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: useCompact ? "compact" : "standard",
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

export const extractWeight = (name: string): string | null => {
  const regex = /(\d+(g|mg|kg|ml))/i;
  const match = name.match(regex);
  return match ? match[0] : null;
};

export const calculateVatAdjustedPrice = (item: CartItem): number => {
  if (item.isVatable) {
    // If VAT-inclusive, divide by 1.12 to remove VAT
    return item.price;
  }
  // If VAT-exempt, return the original price
  return item.price / 1.12;
};

/**
 * Formats a number as a currency string
 * @param value - The number to format
 * @param locale - The locale to use for formatting (default: 'en-PH')
 * @param currency - The currency code (default: 'PHP')
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  locale = "en-PH",
  currency = "PHP"
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a date to a readable string
 * @param date - The date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-PH", options).format(d);
}

/**
 * Truncates text to a specified length
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Generates a short order ID from a full ID
 * @param orderId - The full order ID
 * @param length - Number of characters to keep (default: 8)
 * @returns Shortened order ID
 */
export function shortenOrderId(orderId: string, length = 8): string {
  return orderId.substring(0, length);
}

/**
 * Maps API order status to human-readable status
 * @param status - The API status code
 * @returns Human-readable status text
 */
export function mapOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    ASSIGNING_DRIVER: "Preparing Order",
    ON_GOING: "On the Way",
    PICKED_UP: "Out for Delivery",
    COMPLETED: "Delivered",
    CANCELED: "Canceled",
  };

  return statusMap[status] || status.replace(/_/g, " ");
}

/**
 * Calculates if a given date is today
 * @param date - The date to check
 * @returns Boolean indicating if the date is today
 */
export function isToday(date: Date | string): boolean {
  const today = new Date();
  const checkDate = typeof date === "string" ? new Date(date) : date;

  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
}

/**
 * Gets the time from a date as a formatted string
 * @param date - The date to extract time from
 * @returns Formatted time string
 */
export function getTimeFromDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
