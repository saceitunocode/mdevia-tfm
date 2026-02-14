import { expect, test } from "@playwright/test";

const PUBLIC_PROPERTIES_API = "**/api/v1/properties/public**";
const PAGE_SIZE = 12;

type PropertyPayload = {
  id: string;
  title: string;
  city: string;
  price_amount: number;
  price_currency: string;
  sqm: number;
  rooms: number;
  status: string;
  is_published: boolean;
  images: { id: string; public_url: string; is_cover: boolean; alt_text: string }[];
};

function makeProperty(id: number): PropertyPayload {
  return {
    id: `prop-${id}`,
    title: `Propiedad ${id}`,
    city: "Córdoba",
    price_amount: 100000 + id * 1000,
    price_currency: "EUR",
    sqm: 80 + id,
    rooms: 2 + (id % 3),
    status: "published",
    is_published: true,
    images: [
      {
        id: `img-${id}`,
        public_url: `https://example.com/property-${id}.jpg`,
        is_cover: true,
        alt_text: `Imagen propiedad ${id}`,
      },
    ],
  };
}

test("navega desde home hacia /propiedades", async ({ page }) => {
  await page.route(PUBLIC_PROPERTIES_API, async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
  });

  await page.goto("/");
  await page.getByRole("link", { name: "Ver Propiedades" }).click();

  await expect(page).toHaveURL(/\/propiedades$/);
  await expect(page.getByRole("heading", { name: "Propiedades" })).toBeVisible();
});

test("renderiza cards con campos clave y precio formateado", async ({ page }) => {
  const property = {
    ...makeProperty(1),
    title: "Ático luminoso en centro",
    city: "Andújar",
    price_amount: 250000,
    sqm: 95,
    rooms: 3,
  };

  await page.route(PUBLIC_PROPERTIES_API, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([property]),
    });
  });

  await page.goto("/propiedades");

  await expect(page.getByRole("heading", { name: "Ático luminoso en centro" })).toBeVisible();
  await expect(page.locator("section").getByText("Andújar")).toBeVisible();
  await expect(page.getByText(/250\.000\s?€/)).toBeVisible();
  await expect(page.getByText(/3 hab\./)).toBeVisible();
  await expect(page.getByText(/95 m²/)).toBeVisible();
});

test("sincroniza filtros con URL y permite limpiar", async ({ page }) => {
  await page.route(PUBLIC_PROPERTIES_API, async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
  });

  await page.goto("/propiedades?city=And%C3%BAjar&rooms=2");

  await expect(page.locator("#filter-city")).toHaveValue("Andújar");
  await expect(page.locator("#filter-rooms")).toHaveValue("2");
  await expect(page.getByRole("button", { name: "Limpiar filtros" })).toBeVisible();

  await page.locator('input[name="price_min"]').fill("100000");
  await page.getByRole("button", { name: "Buscar" }).click();

  await expect(page).toHaveURL(/city=And%C3%BAjar/);
  await expect(page).toHaveURL(/rooms=2/);
  await expect(page).toHaveURL(/price_min=100000/);

  await page.getByRole("button", { name: "Limpiar filtros" }).click();
  await expect(page).toHaveURL(/\/propiedades$/);
});

test("muestra error y permite reintentar", async ({ page }) => {
  let calls = 0;

  await page.route(PUBLIC_PROPERTIES_API, async (route) => {
    calls += 1;

    if (calls === 1) {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ detail: "Error interno" }),
      });
      return;
    }

    await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
  });

  await page.goto("/propiedades");

  await expect(page.locator(".animate-pulse").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Error al cargar" })).toBeVisible();

  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(page.getByRole("heading", { name: "No se encontraron propiedades" })).toBeVisible();
});

test("permite paginar con 'Ver más propiedades'", async ({ page }) => {
  const firstPage = Array.from({ length: PAGE_SIZE }, (_, i) => makeProperty(i + 1));
  const secondPage = [makeProperty(101), makeProperty(102)];

  await page.route(PUBLIC_PROPERTIES_API, async (route, request) => {
    const url = new URL(request.url());
    const offset = Number(url.searchParams.get("offset") ?? "0");

    if (offset === 0) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(firstPage),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(secondPage),
    });
  });

  await page.goto("/propiedades");

  await expect(page.getByRole("button", { name: "Ver detalles" })).toHaveCount(PAGE_SIZE);

  await page.getByRole("button", { name: "Ver más propiedades" }).click();

  await expect(page.getByRole("button", { name: "Ver detalles" })).toHaveCount(
    PAGE_SIZE + secondPage.length
  );
  await expect(page.getByRole("button", { name: "Ver más propiedades" })).toHaveCount(0);
});
