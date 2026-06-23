<script setup>
    const navItems = [
        {label: 'Home', to: '/', type: 'link', styling: 'link', size: 'tiny' },
        {label: 'Dashboard', to: '/dashboard', type: 'link', styling: 'link', size: 'tiny' },
        {label: 'Invoice', to: '/invoice/create', type: 'link', styling: 'link', size: 'tiny' },
        {label: 'log ind', to: '/login', type: 'link' },
    ]
</script>

<template>
    <UiNavigation :navItems="navItems">
        <template #icon>
            <h2>InvoiceMaker</h2>
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