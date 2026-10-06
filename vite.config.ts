import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Essential for GitHub Pages subpath deployment (e.g. username.github.io/repo-name/)
  base: "./",
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8888",
        changeOrigin: true,
      },
      "/.netlify/functions": {
        target: "http://localhost:8888",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          markdown: ["react-markdown", "remark-gfm"],
          prism: ["prismjs"],
          icons: ["lucide-react"],
        },
      },
    },
  },
});
