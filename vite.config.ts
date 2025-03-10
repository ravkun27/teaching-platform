import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:8080/api/v1",
  //       changeOrigin: true,
  //       secure: false,  
  //       rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
  //     },
  //   },
  // },
  build: {
    minify: "terser", // Ensures unused code is removed
  },
});
