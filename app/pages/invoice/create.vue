<script setup>
import { useInvoice } from '../../composables/useInvoice';
const { invoice, addItem } = useInvoice();

const downloadInvoice = async () => {
    const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoice.value)
    })

    const blob = await response.blob()

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'faktura.pdf'
    a.click()

    URL.revokeObjectURL(url)
}

const sendInvoice = async () => {
    await $fetch('/api/send', {
        method: 'POST',
        body: invoice.value
    })
}

</script>

<template>
    <header class="invoice-header">
        <h1>Creating invoices</h1>
        <span>
            <UiButton label="Send" styling="secondary" @click-event="sendInvoice" />
            <UiButton label="Download" @click-event="downloadInvoice" />
        </span>
    </header>

    <section class="invoice-fields">
        <input type="text" placeholder="Faktura nr." :value="invoice.invoiceDetails.number" @input="invoice.invoiceDetails.number = $event.target.value">
        <input type="text" placeholder="Kunde navn" :value="invoice.customer.name" @input="invoice.customer.name = $event.target.value">
        <input type="text" placeholder="Kunde adresse" :value="invoice.customer.address" @input="invoice.customer.address = $event.target.value">
        <br>
        <input type="text" placeholder="Firma navn" :value="invoice.firm.name" @input="invoice.firm.name = $event.target.value">
        <input type="text" placeholder="Firma ejer" :value="invoice.firm.owner" @input="invoice.firm.owner = $event.target.value">
        <input type="text" placeholder="Firma adresse" :value="invoice.firm.address" @input="invoice.firm.address = $event.target.value">
        <input type="text" placeholder="Firma telefon" :value="invoice.firm.phone" @input="invoice.firm.phone = $event.target.value">
        <input type="text" placeholder="Firma email" :value="invoice.firm.email" @input="invoice.firm.email = $event.target.value">
        <input type="text" placeholder="Firma cvr" :value="invoice.firm.cvr" @input="invoice.firm.cvr = $event.target.value">
        <br>
        <UiButton label="tilføj" @click-event="addItem"/>
        <span v-for="(item, itemIndex) in invoice.items">
            <input type="text" placeholder="Vare" :value="invoice.items[itemIndex].name" @input="invoice.items[itemIndex].name = $event.target.value">
            <input type="text" placeholder="Mængde" :value="invoice.items[itemIndex].quantity" @input="invoice.items[itemIndex].quantity = $event.target.value">
            <input type="text" placeholder="Pris" :value="invoice.items[itemIndex].price" @input="invoice.items[itemIndex].price = $event.target.value">
        </span>
    </section>
</template>

<style lang="scss" scoped>
    .invoice-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        span {
            display: flex;
            flex-direction: row;
            gap: 1rem;
        }
    }

    .invoice-fields {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        input {
            padding: 0.5rem;
        }
    }
</style>