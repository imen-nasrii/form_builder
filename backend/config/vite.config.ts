import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cartographer } from "@replit/vite-plugin-cartographer";
import runtimeErrorModal from "@replit/vite-plugin-runtime-error-modal";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    cartographer(),
    runtimeErrorModal()
  ],
  root: path.resolve(__dirname, "../../frontend/react/client"),
  css: {
    postcss: path.resolve(__dirname, "../../postcss.config.js"),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../../frontend/react/client/src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@assets": path.resolve(__dirname, "../../frontend/assets"),
    },
  },
  server: {
    strictPort: false,
    host: '0.0.0.0',
    port: 5000,
  },
  build: {
    outDir: path.resolve(__dirname, "../../dist"),
  },
});