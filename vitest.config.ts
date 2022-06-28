import { configDefaults, defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "archive/*"],
    coverage: {
      all: true,
      include: ["src/**/*.ts"],
      reporter: ["text", "json", "html"],
    },
  },
})
