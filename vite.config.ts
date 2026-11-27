import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  // GitHub Pages serves this project from /dima-kiwi/, not the domain root.
  base: mode === "gh-pages" ? "/dima-kiwi/" : "/",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
}));
