<script setup lang="ts">
    import { useInvoice } from '~/composables/useInvoice';

    const { invoice, sendInvoice, resetInvoice } = useInvoice();
    
    const props = defineProps<{
        invoice: any
    }>()

    const dialog = useDialog()
    const mail = ref('');

    const btnAction = (event: any) => {
        dialog.close({
            value: event
        })
    }
    const btns = [
        { label: 'Download', value: 'download', type: 'primary', action: btnAction, size: 'small' },
        { label: 'Tilbage', value: 'cancle', type: 'secondary', action: btnAction, size: 'small' },
    ]
    
    const submitForm = async () => {
        invoice.value = props.invoice.invoice;
        
        await sendInvoice(mail.value);
        await resetInvoice();
        dialog.close();
    }

</script>

<template>
    <UiHeader centered>
        <template #title>
            <h2>Hvad vil du gøre med fakturaen?</h2>
        </template>
    </UiHeader>

    <UiForm @submit="submitForm">
        <UiInput name="mail" type="email" v-model="mail" required placeholder="E-mail" />
        <UiButton label="Send faktura" submit size="small"/>
    </UiForm>

    <UiButton
        v-for="(btn, index) in btns"
        :key="index"
        :label="btn?.label"
        :type="btn?.type"
        :size="btn?.size"
        @click="btn?.action?.(btn?.value)"
    />
</template>