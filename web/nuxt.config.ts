export default defineNuxtConfig({
  compatibilityDate: '2026-02-05',

  devtools: {
    enabled: false,
  },

  css: [
    "~/assets/css/tokens.css",
    "~/assets/css/main.css",
  ],

  runtimeConfig: {
    apiInternalBase: process.env.NUXT_API_INTERNAL_BASE || 'http://api:3001',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001',
    },
  },
});
