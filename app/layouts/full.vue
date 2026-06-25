<template>
    <main class="content-container">
        <div class="content-container--content">
            <slot></slot>
        </div>
    </main>
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