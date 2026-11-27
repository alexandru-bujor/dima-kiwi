import { describe, it, expect } from "vitest";
import { products, subtotal, shippingRemaining, FREE_SHIPPING_THRESHOLD } from "@/lib/store/data";
describe("KiwiKids stated catalog and delivery rules", () => {
  it("prices the white Motion longsleeve at 400 lei", () =>
    expect(products.find((p) => p.id === "motion-longsleeve")?.price).toBe(400));
  it("prices the white Motion sport top at 300 lei", () =>
    expect(products.find((p) => p.id === "motion-top")?.price).toBe(300));
  it("offers free shipping at 600 lei", () => {
    expect(FREE_SHIPPING_THRESHOLD).toBe(600);
    expect(shippingRemaining(599)).toBe(1);
    expect(shippingRemaining(600)).toBe(0);
    expect(shippingRemaining(700)).toBe(0);
  });
  it("calculates the two real products as 700 lei together", () =>
    expect(
      subtotal([
        { productId: "motion-longsleeve", size: "4–5", quantity: 1 },
        { productId: "motion-top", size: "6–7", quantity: 1 },
      ]),
    ).toBe(700));
});
