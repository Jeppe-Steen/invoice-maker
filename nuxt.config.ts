// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@jrs/ui', '@nuxtjs/supabase'],
  supabase: {
    url: 'https://kalbfmaydyybxskxvime.supabase.co',
    key: 'sb_publishable_TjCXmBIrnIr8WivMWZzSKg_NV4KF4ds',
    redirect: false,
  },
})
