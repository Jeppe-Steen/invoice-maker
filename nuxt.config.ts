// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@jrs/core', '@nuxtjs/supabase'],
  supabase: {
    url: 'https://atxybwuigiamqirknwmx.supabase.co',
    key: 'sb_publishable_0cYXN_A5vgCpwIO5atkShw_DlbnDty7',
    redirect: false,
  },
  css: [
    '~/assets/theme.css'
  ],
})
