import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import FullReload from 'vite-plugin-full-reload'
// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    drop: process.env.NODE_ENV === 'development' ? [] : ['console', 'debugger']
  },
  plugins: [react(),
    FullReload(['src/game/**/*.*', 'src/App.tsx', 'src/Game.tsx'])],
  build: {
    // Do not inline images and assets to avoid the phaser error
    // "Local data URIs are not supported"
    assetsInlineLimit: 0
  },
  base: ''
})
