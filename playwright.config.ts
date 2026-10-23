import { defineConfig, devices } from "@playwright/test";

/**
 * Testes de percurso contra o build de produção.
 * Correr `npm run build` antes de `npm run test:e2e`.
 */
const PORT = 3100;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: `http://localhost:${PORT}`, reducedMotion: "reduce" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
