<script setup>
import { useInvoice } from '../../composables/useInvoice';
const { invoice, addItem, removeItem } = useInvoice();

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
        <article class="invoice-fields--customer">
            <h2>Kunde oplysninger:</h2>
            <span>
                <UiInput label="Faktura nr.:" placeholder="Fx. 100" v-model="invoice.invoiceDetails.number" rounded/>
                <UiInput label="Kundens navn:" placeholder="Fx. John Doe" v-model="invoice.customer.name" rounded/>
                <UiInput label="Kundens adresse:" placeholder="Fx. Vesterbro 1, 9000 Aalborg" v-model="invoice.customer.address" rounded/>
            </span>
        </article>

        <article class="invoice-fields--firm">
            <h2>Virksomheds oplysninger:</h2>
            <span>
                <UiInput label="Virksomheds navn:" placeholder="Fx. Min butik" v-model="invoice.firm.name" rounded/>
                <UiInput label="Virksomheds ejer:" placeholder="Fx. John Doe" v-model="invoice.firm.owner" rounded/>
                <UiInput label="Virksomheds adresse:" placeholder="Fx. Vesterbro 2, 9000 Aalborg" v-model="invoice.firm.address" rounded/>
                <UiInput label="Virksomheds telefon nr.:" placeholder="Fx. 10101010" v-model="invoice.firm.phone" rounded/>
                <UiInput label="Virksomheds email:" placeholder="Fx. john.doe@mail.com" v-model="invoice.firm.email" rounded/>
                <UiInput label="Virksomheds CVR:" placeholder="Fx. 10101010" v-model="invoice.firm.cvr" rounded/>
            </span>
        </article>

        <article class="invoice-fields--items">
            <header>
                <h2>Materialer</h2>
                <UiButton label="Tilføj vare" @click-event="addItem" />
            </header>
            <span>
                <div v-for="(item, itemIndex) in invoice.items">
                    <UiInput label="Vare navn:" placeholder="Fx. arbejdstimer" v-model="invoice.items[itemIndex].name" rounded/>
                    <UiInput label="Vare antal:" placeholder="Fx. 10" v-model="invoice.items[itemIndex].quantity" rounded/>
                    <UiInput label="Vare pris:" placeholder="Fx. 100" v-model="invoice.items[itemIndex].price" rounded/>
                    <UiButton label="Slet vare" @click-event="removeItem(itemIndex)"  styling="danger" size="tiny"/>
                </div>
            </span>
        </article>
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
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-areas: 
            'customer firm'
            'items items'
        ;
        gap: 2rem;

        &--customer { grid-area: customer;}

        &--firm { grid-area: firm }

        &--items { 
            grid-area: items;

            header {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                height: 40px;
            }

            span {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;

                div {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    padding: 1rem;
                }
            }
        }
    }
</style>