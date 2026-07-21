<script setup>
    const dialog = useDialog()

    const btnAction = (event) => {
        dialog.close({
            value: event
        })
    }
    const btns = [
        { label: 'Gem', value: 'save', type: 'primary', action: btnAction },
        { label: 'Gem & download', value: 'download', type: 'secondary', action: btnAction },
        { label: 'Tilbage til redigering', value: 'cancle', type: 'secondary', action: btnAction},
    ]
</script>

<template>
    <UiHeader>
        <template #title>
            <h2>Er du klar til at gemme?</h2>
        </template>
    </UiHeader>
    <p>Når fakturaen er gemt, låses den og kan ikke længere ændres.</p>
    <p>Vælg, hvad der skal ske bagefter.</p>
    <UiButton
        v-for="(btn, index) in btns"
        :key="index"
        :label="btn?.label"
        :type="btn?.type"
        @click="btn?.action?.(btn.value)"
    />
</template>