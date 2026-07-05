/**
 * Tests unitaires du store panier.
 * Lancer : pnpm test
 */
import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "../../app/store/cartStore";

const mockProduct = {
  id: "1",
  name: "Red Roses",
  slug: "red-roses",
  price: "29.99",
  category: "1",
  category_name: "Roses",
  photo_url: "https://example.com/rose.jpg",
  in_stock: true,
  stock_quantity: 25,
  is_featured: false,
};

describe("CartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("ajoute un produit au panier", () => {
    useCartStore.getState().addItem(mockProduct);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it("incrémente la quantité si le produit est déjà dans le panier", () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().addItem(mockProduct, 2);
    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });

  it("ne dépasse pas le stock disponible", () => {
    useCartStore.getState().addItem(mockProduct, 30); // stock = 25
    expect(useCartStore.getState().items[0].quantity).toBeLessThanOrEqual(25);
  });

  it("retire un produit du panier", () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().removeItem("1");
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("calcule le total correctement", () => {
    useCartStore.getState().addItem(mockProduct, 2);
    expect(useCartStore.getState().total()).toBeCloseTo(59.98, 2);
  });

  it("vide le panier", () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("compte les articles correctement", () => {
    useCartStore.getState().addItem(mockProduct, 3);
    expect(useCartStore.getState().itemCount()).toBe(3);
  });
});
