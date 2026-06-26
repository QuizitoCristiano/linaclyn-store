/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Desativado por padrão. Só ative se REALMENTE precisar testar HTTPS local algum dia
    // mode !== 'test' && basicSsl(), 
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    https: false, // MUDOU AQUI: Desativa o HTTPS barra-navegador
    host: false,  // MUDOU AQUI: Remove o monte de IPs, roda só no localhost
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.jsx",
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
    server: {
      deps: {
        inline: [/sonner/],
      }
    }
  },
}));