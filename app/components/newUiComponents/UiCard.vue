<script setup lang="ts">
    const props = defineProps<{
        title: string,
        value?: string | number
        subTitle?: string
    }>()
</script>

<template>
    <article class="ui-card">
        <slot name="icon"></slot>
        <div class="ui-card--content">
            <p><strong>{{ props.title }}</strong></p>
            <h2 v-if="props.value">{{ props.value }}</h2>
            <p v-if="props.subTitle">{{ props.subTitle }}</p>
        </div>
    </article>
</template>

<style lang="scss" scoped>
    .ui-card {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        gap: 1rem;

        padding: 20px;
        background-color: white;
        box-shadow: 2px 2px 10px #00000025;
        border-radius: 10px;

        &--content {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    }
</style>