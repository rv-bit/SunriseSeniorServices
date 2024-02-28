import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

const devConfig = {
  server: {
    port: 3000,
    cors: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  envDir: '../',

  // For the build, we want to put the assets in the static directory
  build: {
    assetsDir: "static",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  ...devConfig
})
