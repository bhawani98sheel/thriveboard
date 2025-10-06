import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, existsSync } from "fs";

function copyRedirects() {
  return {
    name: "copy-redirects",
    closeBundle() {
      const src = resolve(__dirname, "public/_redirects");
      const dest = resolve(__dirname, "dist/_redirects");
      if (existsSync(src)) {
        copyFileSync(src, dest);
        console.log("✅ Copied _redirects file to dist/");
      } else {
        console.warn("⚠️ _redirects file not found in public/");
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyRedirects()],
});
