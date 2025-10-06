import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { existsSync, copyFileSync } from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-redirects",
      closeBundle() {
        const src = resolve(__dirname, "public/_redirects");
        const dest = resolve(__dirname, "dist/_redirects");
        if (existsSync(src)) {
          copyFileSync(src, dest);
          console.log("✅ Copied _redirects file to dist/");
        } else {
          console.warn("⚠️ No _redirects file found in public/");
        }
      },
    },
  ],
});
