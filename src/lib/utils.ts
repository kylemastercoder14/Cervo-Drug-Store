import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CartItem } from "../hooks/use-cart";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateTrend(
  current: number,
  previous: number,
  type: "revenue" | "products" | "customers" | "growth"
) {
  if (previous === 0 && current === 0) {
    return {
      percent: 0,
      trend: "flat",
      description: `No ${type} activity this period`,
      recommendation:
        type === "revenue"
          ? "Start generating sales by promoting offers."
          : type === "products"
          ? "Consider adding new products or bundles."
          : type === "customers"
          ? "Try customer acquisition campaigns."
          : "Focus on generating new orders.",
    };
  }

  if (previous === 0 && current > 0) {
    return {
      percent: 100,
      trend: "up",
      description: `Strong new ${type} growth`,
      recommendation:
        type === "revenue"
          ? "Great start! Keep scaling your sales channels."
          : type === "products"
          ? "Good momentum! Ensure stock availability."
          : type === "customers"
          ? "New customers acquired, build loyalty programs."
          : "Great increase in orders, maintain fulfillment speed.",
    };
  }

  const diff = current - previous;
  const percent = (diff / previous) * 100;

  let description = "";
  let recommendation = "";

  if (percent > 0) {
    description =
      type === "revenue"
        ? "Revenue increased compared to last month"
        : type === "products"
        ? "More products sold this month"
        : type === "customers"
        ? "Customer base is growing"
        : "Order volume is rising";

    recommendation =
      type === "revenue"
        ? "Keep optimizing sales and upselling."
        : type === "products"
        ? "Maintain supply and monitor demand trends."
        : type === "customers"
        ? "Engage new customers and improve retention."
        : "Continue improving operations to handle demand.";
  } else if (percent < 0) {
    description =
      type === "revenue"
        ? "Revenue declined compared to last month"
        : type === "products"
        ? "Fewer products sold this month"
        : type === "customers"
        ? "Customer base shrank"
        : "Order volume decreased";

    recommendation =
      type === "revenue"
        ? "Review pricing, promotions, or marketing campaigns."
        : type === "products"
        ? "Investigate why product sales dropped."
        : type === "customers"
        ? "Improve acquisition strategies and retention."
        : "Analyze order flow and address customer concerns.";
  } else {
    description = `No change in ${type} compared to last month`;
    recommendation =
      type === "revenue"
        ? "Stable revenue, consider growth strategies."
        : type === "products"
        ? "Sales are steady, explore upselling opportunities."
        : type === "customers"
        ? "Customer numbers are stable, focus on loyalty."
        : "Order volume is flat, push campaigns to boost activity.";
  }

  return {
    percent: Number(percent.toFixed(1)),
    trend: percent >= 0 ? "up" : "down",
    description,
    recommendation,
  };
}

export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
