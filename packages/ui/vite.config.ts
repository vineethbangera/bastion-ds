import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import pkg from "./package.json" with { type: "json" }

// Anything the consumer installs stays out of the bundle.
const external = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
].map((name) => new RegExp(`^${name}($|/)`))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
      cssFileName: "styles",
    },
    rolldownOptions: { external },
  },
})
