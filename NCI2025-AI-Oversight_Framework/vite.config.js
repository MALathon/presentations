import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/presentations/NCI2025-AI-Oversight_Framework/dist/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})