import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import basicSsl from "@vitejs/plugin-basic-ssl"; // Importando o plugin de segurança

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl(), // Ativa o certificado SSL para o Stripe funcionar
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Mantém seus caminhos organizados
    },
  },
  server: {
    https: true, // Força o uso de HTTPS://
    host: true, // Permite acesso pela rede local se precisar
  },
});
