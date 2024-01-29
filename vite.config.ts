import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "production" ? "/motion-drag-and-drop/" : "/",
  build: {
    outDir: "./docs",
  },
}));
