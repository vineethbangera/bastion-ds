import { fileURLToPath } from "node:url"
import { defineConfig, mergeConfig } from "vitest/config"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import { playwright } from "@vitest/browser-playwright"

import viteConfig from "./vite.config"

const configDir = fileURLToPath(new URL("./.storybook", import.meta.url))

// Every story is a test: it must render, its play function must pass, and
// axe must find no accessibility violations (a11y.test is "error" in
// .storybook/preview.tsx). Stories run twice, once per theme, so contrast
// is checked in Light and Dark.
const storyProject = (theme: "Light" | "Dark") => ({
  extends: true as const,
  plugins: [storybookTest({ configDir })],
  define: { "import.meta.env.BASTION_TEST_THEME": JSON.stringify(theme) },
  test: {
    name: `stories (${theme.toLowerCase()})`,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" as const }],
    },
  },
})

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: { projects: [storyProject("Light"), storyProject("Dark")] },
  })
)
