<script setup>
  import { useAuth } from '~/composables/useAuth'
  const { isLoggedIn, isRegisteredUser, logout } = useAuth();


  const navLinks = computed(() => [
      {label: 'Forside', to: '/', styling: 'link', show: true },
      {label: 'Overblik', to: '/dashboard', styling: 'link', show: isRegisteredUser.value },
      {label: 'Opret faktura', to: '/invoice/create', styling: 'link', show: true },
      {label: 'Log ind', to: '/login', show: !isLoggedIn.value, size: 'medium' },
      {label: 'Log ud', show: isLoggedIn.value, action: logout, size: 'medium' },
  ].filter(item => item.show ?? true));
</script>

<template>
  <UiNavigation>
    <template #logo>
        <h2>InvoiceMaker</h2>
    </template>

    <template #links>
      <UiButton
        v-for="item in navLinks"
        :key="item.label"
        :label="item.label"
        :to="item.to"
        :styling="item.styling"
        :size="item.size"
        @click="item.action?.()"
      />
    </template>
  </UiNavigation>

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <UiFooter />
</template>