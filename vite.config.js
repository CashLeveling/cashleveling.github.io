import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Relative path for GitHub Pages with HashRouter
  build: {
    outDir: 'dist'
  }
})
