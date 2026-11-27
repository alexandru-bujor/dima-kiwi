import sleeve from "@/assets/motion-longsleeve.webp";
import top from "@/assets/motion-top.webp";
import performance from "@/assets/category-performance.webp";
import leggings from "@/assets/category-leggings.webp";
import tops from "@/assets/category-tops.webp";
import jackets from "@/assets/category-jackets.webp";
import skirts from "@/assets/category-skirts.webp";
import lifestyle from "@/assets/category-lifestyle.webp";
export const categories = [
  { slug: "performance", key: "performance", image: performance },
  { slug: "leggings", key: "leggings", image: leggings },
  { slug: "tops", key: "tops", image: tops },
  { slug: "jackets", key: "jackets", image: jackets },
  { slug: "skirts", key: "skirts", image: skirts },
  { slug: "lifestyle", key: "lifestyle", image: lifestyle },
] as const;
export const sizes = ["4–5", "5–6", "6–7", "7–8", "8–9", "9–10", "10–12"];
export type Product = {
  id: string;
  slug: string;
  nameKey: string;
  price: number;
  image: string;
  gender: "unisex" | "girls";
  category: string;
  sku: string;
};
export const products: Product[] = [
  {
    id: "motion-longsleeve",
    slug: "longsleeve-motion-alb",
    nameKey: "sleeveName",
    price: 400,
    image: sleeve,
    gender: "unisex",
    category: "tops",
    sku: "KW-MOT-LS-W",
  },
  {
    id: "motion-top",
    slug: "top-sport-motion-alb",
    nameKey: "topName",
    price: 300,
    image: top,
    gender: "girls",
    category: "tops",
    sku: "KW-MOT-TP-W",
  },
];
export type CartItem = { productId: string; size: string; quantity: number };
export const FREE_SHIPPING_THRESHOLD = 600;
export const subtotal = (items: CartItem[]) =>
  items.reduce(
    (sum, item) =>
      sum + (products.find((p) => p.id === item.productId)?.price ?? 0) * item.quantity,
    0,
  );
export const shippingRemaining = (amount: number) => Math.max(0, FREE_SHIPPING_THRESHOLD - amount);
