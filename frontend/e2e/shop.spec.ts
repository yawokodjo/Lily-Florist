/**
 * Tests E2E — Parcours d'achat complet.
 * Lancer : pnpm test:e2e
 */
import { test, expect } from "@playwright/test";

test.describe("Parcours d'achat", () => {
  test("affiche la page d'accueil avec les produits mis en avant", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Fresh Flowers");
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount({ minimum: 1 });
  });

  test("navigue vers la boutique et filtre par catégorie", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.getByTestId("product-grid")).toBeVisible();

    // Filtre par catégorie
    await page.getByRole("button", { name: "Roses" }).click();
    const cards = page.getByTestId("product-card");
    await expect(cards.first()).toContainText("Rose");
  });

  test("ajoute un produit au panier et vérifie le badge", async ({ page }) => {
    await page.goto("/shop");
    await page.getByTestId("add-to-cart").first().click();

    const cartBadge = page.getByTestId("cart-badge");
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText("1");
  });

  test("accède au panier et modifie la quantité", async ({ page }) => {
    await page.goto("/shop");
    await page.getByTestId("add-to-cart").first().click();
    await page.goto("/cart");

    await expect(page.getByTestId("cart-item")).toHaveCount(1);

    // Incrémenter la quantité
    await page.getByTestId("qty-increase").click();
    await expect(page.getByTestId("qty-display")).toHaveText("2");
  });

  test("inscription d'un nouvel utilisateur", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Prénom").fill("Marie");
    await page.getByLabel("Nom").fill("Dupont");
    await page.getByLabel("Email").fill(`test+${Date.now()}@lily.com`);
    await page.getByLabel("Mot de passe").fill("SecurePass123!");
    await page.getByRole("button", { name: "S'inscrire" }).click();

    // Redirigé vers l'accueil après inscription
    await expect(page).toHaveURL("/");
  });
});
