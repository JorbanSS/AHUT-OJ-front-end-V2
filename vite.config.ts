import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';

export default defineConfig({
  plugins: [
    vue(),
    VueSetupExtend(),
  ],
  server: {
    // host: '0.0.0.0',
    hmr: true,
    port: 8080,
    // port: 4433,
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
  base: '/',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/assets/scss/base.scss";',
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})