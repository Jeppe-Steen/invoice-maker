<script setup>
    const dialog = useDialog()

    const btnAction = (event) => {
        dialog.close({
            value: event
        })
    }
    const btns = [
        { label: 'Opret ny faktura', value: 'reset', type: 'primary', action: btnAction },
        { label: 'Fortsæt med at redigere', value: 'cancle', type: 'secondary', action: btnAction},
    ]
</script>

<template>
    <UiHeader>
        <template #title>
            <h2>Klar til en ny faktura?</h2>
        </template>
    </UiHeader>
    
    <p>Hvis du opretter en ny faktura nu, bliver den nuværende faktura nulstillet. Husk at gemme den først, hvis du vil beholde dine ændringer.</p>
    
    <UiButton
        v-for="(btn, index) in btns"
        :key="index"
        :label="btn?.label"
        :type="btn?.type"
        @click="btn?.action?.(btn?.value)"
    />
</template>