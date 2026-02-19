import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',  // ← CRUCIAL pour Docker
    strictPort: true,  // Ne pas changer de port si 5173 est pris
    watch: {
      usePolling: true,
    }
  }
})