import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/patient-portal/",
  build: { sourcemap: false },
  plugins: [react()],
});
