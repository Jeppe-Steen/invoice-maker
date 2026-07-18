<script setup>
  import { useAuth } from '~/composables/useAuth'
  const { isLoggedIn, isRegisteredUser, logout } = useAuth();

  const navLinks = computed(() => [
      {label: 'Overblik', to: '/dashboard', type: 'link', show: isLoggedIn.value && isRegisteredUser.value },
      {label: 'Opret faktura', to: '/invoice/create', type: 'link', show: true },
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
    .content-container {
        width: 100%;
        min-height: 100vh;
        background-color: var(--ui-background-primary);
        padding: 2rem;

        display: grid;
        grid-template-columns: 1fr minmax(0, 80%) 1fr;
        gap: 1rem;
        grid-template-areas: '. content .';

        &--content {
            grid-area: content;
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

    }
</style>