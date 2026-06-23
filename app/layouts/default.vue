<script setup>
    const navItems = [
        {label: 'home', to: '/', type: 'link' },
        {label: 'log ind', to: '/login', type: 'link', styling: 'secondary' }
    ]
</script>

<template>
    <UiNavigation :navItems="navItems">
        <template #icon>
            <h2>Logo her!</h2>
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
        grid-template-columns: 1fr minmax(0, 70%) 1fr;
        gap: 1rem;
        grid-template-areas: '. content .';

        &--content {
            grid-area: content;
            padding: 1rem;
        }

    }
</style>