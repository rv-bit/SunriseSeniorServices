import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

const devConfig = {
  server: {
    port: 3000,
    cors: true,
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
};

const prodConfig = {}
const config = process.env.NODE_ENV === 'development' ? devConfig : prodConfig;

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // This is the equivalent of the publicPath
  envDir: '../', // This is the equivalent of the path to the .env file in the root directory

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

  ...config
})
