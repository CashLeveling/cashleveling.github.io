import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  base: '/cashleveling.github.io/', // Set base to your repository name
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
