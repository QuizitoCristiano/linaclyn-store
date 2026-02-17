/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl(), // Ativa o certificado SSL para o Stripe funcionar
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    https: true,
    host: true,
  },
  // --- ADICIONANDO A SEÇÃO DE TESTES (VITEST) ---
  test: {
    globals: true, // Permite usar describe/it/expect sem importá-los em cada arquivo
    environment: "jsdom", // Essencial para simular o DOM do navegador nos componentes React
    setupFiles: "./src/setupTests.js", // Arquivo para extensões de segurança e matchers do DOM
    include: ["src/**/*.{test,spec}.{js,jsx}"], // Garante que ele só procure testes dentro da src
  },
});
