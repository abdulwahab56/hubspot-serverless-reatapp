import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 7000,
    open: true,
  },
  build: {
    outDir: "dist", // default, but explicit is good
  },
  base: "/", // ✅ important for S3, use relative paths
})
