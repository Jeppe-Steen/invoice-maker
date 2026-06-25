<script setup>
  import { useAuth } from '~/composables/useAuth'
  const { isLoggedIn, isRegisteredUser } = useAuth();
  const navItems = computed(() => [
      {label: 'Forside', to: '/', type: 'link', styling: 'link', size: 'tiny', show: true },
      {label: 'Overblik', to: '/dashboard', type: 'link', styling: 'link', size: 'tiny', show: isRegisteredUser.value },
      {label: 'Opret faktura', to: '/invoice/create', type: 'link', styling: 'link', size: 'tiny', show: true },
      {label: 'Log ind', to: '/login', type: 'link', show: !isLoggedIn.value },
      {label: 'Log ud', type: 'btn', show: isLoggedIn.value },
  ].filter(item => item.show ?? true));
</script>

<template>
  <UiNavigation :navItems="navItems">
    <template #icon>
        <h2>InvoiceMaker</h2>
    </template>
  </UiNavigation>

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <UiFooter />
</template>