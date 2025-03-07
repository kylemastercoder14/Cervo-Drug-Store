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
