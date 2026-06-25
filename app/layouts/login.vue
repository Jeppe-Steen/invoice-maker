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
        min-height: 90vh;
        background-color: var(--background-color);
        padding: 2rem;

        display: grid;
        grid-template-columns: 1fr minmax(0, 70%) 1fr;
        gap: 1rem;
        grid-template-areas: '. content .';

        &--content {
            grid-area: content;
            display: flex;
            align-items: center;
            justify-content: center;
        }

    }
</style>