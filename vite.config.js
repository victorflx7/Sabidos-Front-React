import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    mkcert(),
  ],
  server: {
    port: 5173,
    // Ativa o suporte a HTTPS usando o certificado gerado pelo plugin
    https: true 
  }
})
