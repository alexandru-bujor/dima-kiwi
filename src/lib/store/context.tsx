import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type CartItem, sizes, products } from "./data";
type StoreState = {
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  add: (id: string, size: string, quantity: number) => void;
  quantity: (id: string, size: string, value: number) => void;
  toggleWish: (id: string) => void;
};
const StoreContext = createContext<StoreState | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem("kiwi-cart") ?? "[]");
      if (Array.isArray(saved))
        setCart(
          saved
            .filter(
              (item): item is CartItem =>
                typeof item === "object" &&
                item !== null &&
                products.some((p) => p.id === item.productId) &&
                sizes.includes(item.size) &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0,
            )
            .map((item) => ({ ...item, quantity: Math.min(item.quantity, 10) })),
        );
      const wishes: unknown = JSON.parse(localStorage.getItem("kiwi-wishlist") ?? "[]");
      if (Array.isArray(wishes))
        setWishlist(
          wishes.filter(
            (v): v is string => typeof v === "string" && products.some((p) => p.id === v),
          ),
        );
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      localStorage.setItem("kiwi-cart", JSON.stringify(cart));
      localStorage.setItem("kiwi-wishlist", JSON.stringify(wishlist));
    }
  }, [cart, wishlist, ready]);
  const add = (id: string, size: string, quantity: number) => {
    if (!sizes.includes(size)) return;
    setCart((old) => {
      const existing = old.find((i) => i.productId === id && i.size === size);
      return existing
        ? old.map((i) =>
            i === existing ? { ...i, quantity: Math.min(10, i.quantity + quantity) } : i,
          )
        : [...old, { productId: id, size, quantity: Math.min(10, quantity) }];
    });
    setCartOpen(true);
  };
  const quantity = (id: string, size: string, value: number) =>
    setCart((old) =>
      value < 1
        ? old.filter((i) => i.productId !== id || i.size !== size)
        : old.map((i) =>
            i.productId === id && i.size === size ? { ...i, quantity: Math.min(10, value) } : i,
          ),
    );
  const toggleWish = (id: string) =>
    setWishlist((old) => (old.includes(id) ? old.filter((v) => v !== id) : [...old, id]));
  return (
    <StoreContext.Provider
      value={{ cart, wishlist, cartOpen, setCartOpen, add, quantity, toggleWish }}
    >
      {children}
    </StoreContext.Provider>
  );
}
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("StoreProvider required");
  return context;
}
