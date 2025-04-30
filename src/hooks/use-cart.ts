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

interface CartStore {
  items: CartItem[];
  addItem: (data: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],

      addItem: (data: CartItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          // If item exists, update the quantity
          set({
            items: currentItems.map((item) =>
              item.id === data.id
                ? { ...item, quantity: item.quantity + data.quantity }
                : item
            ),
          });
          toast.success("Product quantity updated in cart");
        } else {
          // If item doesn't exist, add it to the cart
          set({ items: [...currentItems, data] });
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
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
