<script setup lang="ts">
import { useInvoice } from '~/composables/useInvoice';
import { useProfile } from '~/composables/useProfile';
import { useAuth } from '~/composables/useAuth';


const { invoice, addItem, removeItem, resetInvoice, applyProfile, loadNextInvoiceNumber } = useInvoice()
const { profile, loadProfile } = useProfile()
const { isRegisteredUser } = useAuth()

definePageMeta({
    middleware: ['auth']
})

onMounted(async () => {
  await loadProfile()

  if (profile.value) {
    applyProfile(profile.value)
  }

  await loadNextInvoiceNumber()
})

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
    a.download = `faktura-`+ invoice.value.invoiceDetails.number + `.pdf`
    a.click()

    URL.revokeObjectURL(url)
}

const sendInvoice = async () => {
    await $fetch('/api/send', {
        method: 'POST',
        body: invoice.value
    })
}

const subtotal = computed(() => {
    return invoice.value.items.reduce((sum: number, item: any) => {
        return sum + Number(item.price) * Number(item.quantity)
    }, 0)
})

const tax = computed(() => {
    return subtotal.value * 0.25
})

const total = computed(() => {
    return subtotal.value + tax.value
})

const getItemTotal = (item: any) => {
    return Number(item.price) * Number(item.quantity)
}

const buttons = computed(() => [
    { label: 'Ny faktura', styling: 'secondary', action: resetInvoice, show: true},
    { label: 'Gem', styling: 'secondary', action: () => {console.log('teeest')}, show: isRegisteredUser.value },
    { label: 'Send', styling: 'secondary', action: sendInvoice, show: isRegisteredUser.value},
    { label: 'Download', action: downloadInvoice, show: true },
].filter(item => item.show ?? true));

</script>

<template>
    <header class="invoice-header">
        <h1>Opret faktura</h1>
        <span>
            <UiButton
                v-for="btn in buttons"
                :key="btn.label"
                :label="btn.label"
                :styling="btn.styling"
                :show="btn.show"
                @click="btn.action?.()"
            />
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
                <UiButton
                    label="Tilføj vare"
                    @click="addItem"
                />
            </header>

            <table>
                <thead>
                    <tr>
                        <th>Varer</th>
                        <th>Antal</th>
                        <th>Pris</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, itemIndex) in invoice.items">
                        <td colspan="1"><UiInput placeholder="Fx. arbejdstimer" v-model="invoice.items[itemIndex]!.name" rounded/></td>
                        <td colspan="1"><UiInput placeholder="Fx. 10" v-model="invoice.items[itemIndex]!.quantity" rounded/></td>
                        <td colspan="1"><UiInput placeholder="Fx. 100" v-model="invoice.items[itemIndex]!.price" rounded/></td>
                        <td colspan="1">{{ getItemTotal(item) }} {{ invoice.invoiceDetails.currency }}</td>
                        <td colspan="1"> <UiButton label="X" @click="removeItem(itemIndex)" styling="danger" size="small"/></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="3">Pris eksl. moms</th>
                        <td>{{ subtotal }} {{ invoice.invoiceDetails.currency }}</td>
                    </tr>
                    <tr>
                        <th colspan="3">Moms</th>
                        <td>{{ tax }} {{ invoice.invoiceDetails.currency }}</td>
                    </tr>
                    <tr>
                        <th colspan="3">Pris incl. moms</th>
                        <th>{{ total }} {{ invoice.invoiceDetails.currency }}</th>
                    </tr>
                </tfoot>
            </table>
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

        &--customer { 
            grid-area: customer;
            display: flex;
            flex-direction: column;
            gap: 1rem;

            span {
                display: flex; flex-direction: column; gap: 1rem;
            }
        }

        &--firm { 
            grid-area: firm;
            display: flex;
            flex-direction: column;
            gap: 1rem;

            span {
                display: flex; flex-direction: column; gap: 1rem;
            } 
        }

        &--items { 
            grid-area: items;
            display: flex;
            flex-direction: column;
            gap: 1rem;

            header {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                height: 40px;
            }

            table {
                width: 100%;

                th, td {
                    text-align: center;
                }

                thead {
                    background-color: #0D0E10;
                    color: #FAFAFA;

                    th {
                        padding: .5rem;
                    }
                }

                tbody {
                    tr {
                        background-color: #c6c6c6;

                        &:nth-child(odd) {
                            background-color: #e2e2e2;
                        }
                        
                        td {
                            width: 1fr;

                            &:last-of-type {
                                width: 10%;
                                padding: .5rem;
                            }
                        }
                    }
                }

                tfoot {
                    th, td {
                        padding: .5rem;
                    }
                }
            }
        }
    }
</style>