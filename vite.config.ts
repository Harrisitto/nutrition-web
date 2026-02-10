import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/nutrition-web/', // GitHub Pages base path
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src')
    }
  }
})
