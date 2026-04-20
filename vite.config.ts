import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import visualizer from 'rollup-plugin-visualizer'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/nutrition-web/',
  plugins: [react(), visualizer({ open: true })],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-dom/client'],
        },
      },
    },
  },
})
