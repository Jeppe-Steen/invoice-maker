export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser()

  if (!user.value || user.value.is_anonymous) {
    return navigateTo('/login')
  }
})