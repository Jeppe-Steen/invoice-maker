// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@jrs/core', '@nuxtjs/supabase'],
  supabase: {
    url: import.meta.env.NUXT_PUBLIC_SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: import.meta.env.NUXT_PUBLIC_SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY,
    redirect: false,
  },
  css: [
    '~/assets/theme.css'
  ],
})
