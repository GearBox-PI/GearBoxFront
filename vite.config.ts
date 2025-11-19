import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@/components": path.resolve(__dirname, "./src/shared/components"),
      "@/contexts": path.resolve(__dirname, "./src/shared/contexts"),
      "@/hooks": path.resolve(__dirname, "./src/shared/hooks"),
      "@/lib": path.resolve(__dirname, "./src/shared/lib"),
      "@/services": path.resolve(__dirname, "./src/shared/services"),
      "@/types": path.resolve(__dirname, "./src/shared/types"),
      "@/config": path.resolve(__dirname, "./src/shared/config"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
