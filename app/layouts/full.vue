<script setup>
  import { useAuth } from '~/composables/useAuth'
  const { isLoggedIn, isRegisteredUser, logout } = useAuth();


  const navLinks = computed(() => [
      {label: 'Forside', to: '/', type: 'link', show: true },
      {label: 'Overblik', to: '/dashboard', type: 'link', show: isLoggedIn.value && isRegisteredUser.value },
      {label: 'Opret faktura', to: '/invoice/create', type: 'link', show: true },
      {label: 'Log ind', to: '/login', show: !isLoggedIn.value, size: 'medium' },
      {label: 'Log ud', show: isLoggedIn.value, action: logout, size: 'medium' },
  ].filter(item => item.show ?? true));
</script>
<template>
    <UiNavigation>
        <template #logo>
            <span class="logo">
                <UiIcon name="document" size="30"/>
                <h2>Faktivo</h2>
            </span>
        </template>

        <template #links>
        <UiButton
            v-for="item in navLinks"
            :key="item.label"
            :label="item.label"
            :to="item.to"
            :type="item.type"
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
    .logo {
        display: flex; flex-direction: row; gap: .5rem;
    }
    
    .content-container {
        width: 100%;
        min-height: 100vh;
        background-color: var(--ui-background-primary);

        display: grid;
        grid-template-columns: 100%;
        gap: 1rem;
        grid-template-areas: 'content';

        &--content {
            grid-area: content;
        }

    }
</style>