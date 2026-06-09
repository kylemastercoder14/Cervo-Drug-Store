import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  tags: string;
  isPrescriptionRequired: boolean;
  isVatable: boolean;
  quantity: number;
  description: string;
}

type PersistedCartItem = Partial<CartItem> & {
  productId?: string;
  product?: Partial<CartItem> & { isVatItem?: boolean };
  isVatItem?: boolean;
};

interface CartStore {
  items: CartItem[];
  addItem: (data: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeAll: () => void;
}

const normalizeCartItem = (item: unknown): CartItem | null => {
  if (!item || typeof item !== "object") {
    return null;
  }

  const cartItem = item as PersistedCartItem;
  const id = String(
    cartItem.id || cartItem.productId || cartItem.product?.id || "",
  ).trim();

  if (!id) {
    return null;
  }

  const price = Number(cartItem.price ?? cartItem.product?.price ?? 0);
  const quantity = Math.max(1, Math.floor(Number(cartItem.quantity ?? 1)));

  return {
    id,
    name: String(cartItem.name || cartItem.product?.name || "Product"),
    image: String(cartItem.image || cartItem.product?.image || ""),
    price: Number.isFinite(price) ? price : 0,
    tags: String(cartItem.tags || cartItem.product?.tags || ""),
    isPrescriptionRequired: Boolean(
      cartItem.isPrescriptionRequired || cartItem.product?.isPrescriptionRequired,
    ),
    isVatable: Boolean(
      cartItem.isVatable ?? cartItem.isVatItem ?? cartItem.product?.isVatItem,
    ),
    quantity: Number.isFinite(quantity) ? quantity : 1,
    description: String(
      cartItem.description || cartItem.product?.description || "",
    ),
  };
};

const normalizeCartItems = (items: unknown): CartItem[] => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.reduce<CartItem[]>((validItems, item) => {
    const normalizedItem = normalizeCartItem(item);

    if (!normalizedItem) {
      return validItems;
    }

    const existingItem = validItems.find(
      (currentItem) => currentItem.id === normalizedItem.id,
    );

    if (existingItem) {
      existingItem.quantity += normalizedItem.quantity;
      return validItems;
    }

    validItems.push(normalizedItem);
    return validItems;
  }, []);
};

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],

      addItem: (data: CartItem) => {
        const normalizedData = normalizeCartItem(data);

        if (!normalizedData) {
          toast.error("Unable to add this product to cart.");
          return;
        }

        const currentItems = normalizeCartItems(get().items);
        const existingItem = currentItems.find(
          (item) => item.id === normalizedData.id,
        );

        if (existingItem) {
          // If item exists, update the quantity
          set({
            items: currentItems.map((item) =>
              item.id === normalizedData.id
                ? { ...item, quantity: item.quantity + normalizedData.quantity }
                : item
            ),
          });
          toast.success("Product quantity updated in cart");
        } else {
          // If item doesn't exist, add it to the cart
          set({ items: [...currentItems, normalizedData] });
          toast.success("Product added to cart");
        }
      },

      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        toast.success("Product removed from cart");
      },

      updateQuantity: (id: string, quantity: number) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
        toast.success("Quantity updated");
      },

      removeAll: () => {
        set({ items: [] });
      },
    }),
    {
      name: "cart-storage",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState) => {
        const state = persistedState as Partial<CartStore> | undefined;

        return {
          ...state,
          items: normalizeCartItems(state?.items),
        } as CartStore;
      },
    }
  )
);

export default useCart;
