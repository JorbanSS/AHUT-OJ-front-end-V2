import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
// import { visualizer } from "rollup-plugin-visualizer";
// import { autoComplete, Plugin as importToCDN } from "vite-plugin-cdn-import";

export default defineConfig({
  plugins: [
    vue(),
    VueSetupExtend(),
    // visualizer({
    //   emitFile: false,
    //   filename: "stats.html",
    //   open: true,
    //   sourcemap: true,
    // }),
    // importToCDN({
    //   modules: [
    //     autoComplete("lodash"),
    //     {
    //       name: "xlsx-js-style",
    //       var: "xlsx-js-style",
    //       path: "https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.min.js",
    //     },
    //   ],
    // }),
  ],

  server: {
    // host: '0.0.0.0',
    hmr: true,
    port: 8080,
    // open: true,
    // https: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1/',
    //     changeOrigin: true,
    //     cookiePathRewrite: {
    //       '^/api': '/',
    //     }
    //   }
    // },
  },
  base: "/",
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/assets/scss/base.scss";',
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  // build: {
  //   sourcemap: true,
  // },
});
