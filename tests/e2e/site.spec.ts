import { expect, test, type Page } from "@playwright/test";

const PAGES = [
  "/",
  "/viaturas",
  "/viaturas/bmw-serie-3-2021-diesel",
  "/viaturas/bmw-serie-1-2020-gasolina",
  "/viaturas/seat-leon-2022-gasolina",
  "/viaturas/seat-leon-2021-diesel",
  "/oficina",
  "/sobre-nos",
  "/contactos",
  "/privacidade",
];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

test.describe("páginas", () => {
  for (const path of PAGES) {
    test(`${path} carrega sem erros e sem scroll horizontal`, async ({ page }) => {
      const errors = collectErrors(page);
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/Auto Castelo Branco/);
      expect(await page.locator('meta[name="description"]').getAttribute("content")).toBeTruthy();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  }

  test("não existem links internos quebrados", async ({ page, request }) => {
    const links = new Set<string>();
    for (const path of PAGES) {
      await page.goto(path);
      const hrefs = await page.$$eval("a[href^='/']", (as) => as.map((a) => a.getAttribute("href")!));
      hrefs.forEach((h) => links.add(h.split("#")[0] || "/"));
    }
    for (const link of links) {
      const res = await request.get(link);
      expect(res.status(), link).toBe(200);
    }
  });

  test("viatura inexistente devolve 404", async ({ page }) => {
    const res = await page.goto("/viaturas/nao-existe");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("saiu de circulação");
  });

  test("em modo demonstração não é indexável", async ({ page, request }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/viaturas/seat-leon-2022-gasolina");
  });
});

test.describe("inventário", () => {
  test("filtros por marca, combustível, preço e ordenação atualizam resultados e URL", async ({ page, isMobile }) => {
    await page.goto("/viaturas");
    const count = page.locator("p[aria-live='polite'][aria-atomic='true']");
    await expect(count).toHaveText("4 viaturas");

    const scope = isMobile ? page.locator("dialog") : page.getByRole("group", { name: "Filtros" });
    if (isMobile) await page.getByRole("button", { name: /Filtros/ }).click();

    await scope.getByRole("button", { name: "SEAT", exact: true }).click();
    await expect(page).toHaveURL(/marca=seat/);
    await expect(count).toHaveText("2 viaturas");

    await scope.getByRole("button", { name: "Diesel", exact: true }).click();
    await expect(page).toHaveURL(/combustivel=diesel/);
    await expect(count).toHaveText("1 viatura");

    await scope.getByRole("button", { name: "BMW", exact: true }).click();
    await scope.getByLabel("Preço máximo").selectOption("20000");
    await expect(count).toHaveText("0 viaturas");
    if (isMobile) await page.getByRole("button", { name: "Fechar filtros" }).click();
    await expect(page.getByText("Nenhuma viatura corresponde")).toBeVisible();
    await page.getByRole("button", { name: /Limpar filtros/ }).first().click();
    await expect(count).toHaveText("4 viaturas");

    await page.getByLabel("Ordenar por").selectOption("preco-asc");
    await expect(page).toHaveURL(/ordem=preco-asc/);
    const prices = await page.locator("main ol > li article p.shrink-0").allTextContents();
    expect(prices.map((p) => p.replace(/\D/g, ""))).toEqual(["18500", "19900", "21900", "29900"]);
  });

  test("filtros chegam por URL partilhado", async ({ page }) => {
    await page.goto("/viaturas?marca=bmw&ordem=ano-desc");
    await expect(page.locator("p[aria-live='polite'][aria-atomic='true']")).toHaveText("2 viaturas");
  });

  test("cartão leva à página da viatura", async ({ page }) => {
    await page.goto("/viaturas");
    await page.getByRole("link", { name: /Série 3/ }).first().click();
    await expect(page).toHaveURL(/\/viaturas\/bmw-serie-3-2021-diesel/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Série 3");
  });
});

test.describe("página de viatura", () => {
  test("galeria navega por botões e teclado", async ({ page, isMobile }) => {
    await page.goto("/viaturas/bmw-serie-3-2021-diesel");
    const counter = page.locator("[aria-roledescription='galeria'] p[aria-live]");
    await expect(counter).toHaveText("01 / 06");
    if (!isMobile) {
      await page.getByRole("button", { name: "Imagem seguinte" }).click();
      await expect(counter).toHaveText("02 / 06");
      await page.getByRole("button", { name: "Imagem anterior" }).click();
      await expect(counter).toHaveText("01 / 06");
    }
    await page.getByRole("button", { name: /Ver imagem 4/ }).click();
    await expect(counter).toHaveText("04 / 06");
    await page.getByLabel("Use as setas do teclado para mudar de imagem").focus();
    await page.keyboard.press("ArrowLeft");
    await expect(counter).toHaveText("03 / 06");
  });

  test("pedido de informação identifica a viatura, valida e confirma", async ({ page }) => {
    await page.goto("/viaturas/seat-leon-2022-gasolina#pedido");
    const form = page.locator("#pedido form");
    await expect(form).toContainText("SEAT Leon · 2022 · 19");

    await form.getByRole("button", { name: "Pedir informação" }).click();
    await expect(form.getByText("Indique o seu nome.")).toBeVisible();
    await expect(form.getByText("É necessário aceitar")).toBeVisible();
    await expect(form.getByLabel("Nome")).toBeFocused();

    await form.getByLabel("Nome").fill("Ana Silva");
    await form.getByLabel("Telefone").fill("912 345 678");
    await form.getByRole("checkbox").check();
    await form.getByRole("button", { name: "Pedir informação" }).click();
    await expect(page.getByText("Pedido recebido.")).toBeVisible();
    await expect(page.getByText(/Modo demonstração: o pedido foi validado mas não foi enviado/)).toBeVisible();
  });
});

test.describe("oficina", () => {
  test("pedido de marcação: validação, pré-seleção de serviço e confirmação", async ({ page }) => {
    await page.goto("/oficina?servico=travagem#marcacao");
    const form = page.locator("#marcacao form");
    await expect(form.getByLabel("Serviço pretendido")).toHaveValue("travagem");

    await form.getByRole("button", { name: "Pedir marcação" }).click();
    await expect(form.getByText("Indique a marca e o modelo do veículo.")).toBeVisible();
    await expect(form.getByText("Indique uma data preferencial.")).toBeVisible();

    const date = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
    await form.getByLabel("Nome").fill("Rui Costa");
    await form.getByLabel("Email").fill("rui@exemplo.pt");
    await form.getByLabel("Marca e modelo do veículo").fill("Renault Clio 2017");
    await form.getByLabel("Data preferencial").fill(date);
    await form.getByRole("checkbox").check();
    await form.getByRole("button", { name: "Pedir marcação" }).click();
    await expect(page.getByText("Pedido de marcação recebido.")).toBeVisible();
    await expect(page.getByText(/só fica confirmada quando entrarmos em contacto/)).toBeVisible();
  });
});

test.describe("contactos", () => {
  test("formulário de contacto com assunto pré-selecionado", async ({ page }) => {
    await page.goto("/contactos?assunto=procura#formulario");
    const form = page.locator("#formulario form");
    await expect(form.getByLabel("Assunto")).toHaveValue("procura");
    await form.getByLabel("Nome").fill("Marta");
    await form.getByLabel("Email").fill("email-invalido");
    await form.getByLabel("Mensagem").fill("Procuro um SEAT Ibiza.");
    await form.getByRole("checkbox").check();
    await form.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(form.getByText(/Confirme o endereço de email/)).toBeVisible();
    await form.getByLabel("Email").fill("marta@exemplo.pt");
    await form.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(page.getByText("Mensagem recebida.")).toBeVisible();
  });

  test("a API rejeita pedidos inválidos", async ({ request }) => {
    expect((await request.post("/api/pedidos", { data: { kind: "contacto", name: "", consent: true } })).status()).toBe(422);
    expect((await request.post("/api/pedidos", { data: "not json", headers: { "Content-Type": "text/plain" } })).status()).toBe(400);
    expect((await request.post("/api/pedidos", { data: { kind: "viatura", name: "Ana", phone: "912345678", consent: true, vehicleId: "inexistente", message: "" } })).status()).toBe(422);
  });
});

test.describe("navegação", () => {
  test("menu móvel abre, prende o foco e fecha com Escape", async ({ page, isMobile }) => {
    test.skip(!isMobile, "apenas telemóvel");
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Abrir menu" });
    await toggle.click();
    const panel = page.locator("#menu-movel");
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("link", { name: /Início/ })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(page.getByRole("button", { name: "Abrir menu" })).toBeFocused();

    await page.getByRole("button", { name: "Abrir menu" }).click();
    await panel.getByRole("link", { name: /Oficina/ }).click();
    await expect(page).toHaveURL(/\/oficina$/);
    await expect(panel).toBeHidden();
  });

  test("navegação por teclado: saltar para o conteúdo", async ({ page, isMobile }) => {
    test.skip(isMobile, "apenas desktop");
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Saltar para o conteúdo" })).toBeFocused();
  });
});
