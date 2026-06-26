<script setup>
  import { useAuth } from '~/composables/useAuth'
  const { isLoggedIn, isRegisteredUser, logout } = useAuth();


  const navLinks = computed(() => [
      {label: 'Forside', to: '/', styling: 'link', show: true },
      {label: 'Overblik', to: '/dashboard', styling: 'link', show: isLoggedIn.value && isRegisteredUser.value },
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

    <main class="content-container">
        <div class="content-container--content">
            <slot></slot>
        </div>
    </main>

    <UiFooter />
</template>

<style scoped lang="scss">
    .content-container {
        width: 100%;
        min-height: 100vh;
        background-color: var(--background-color);

        display: grid;
        grid-template-columns: 100%;
        gap: 1rem;
        grid-template-areas: 'content';

        &--content {
            grid-area: content;
        }

    }
</style>