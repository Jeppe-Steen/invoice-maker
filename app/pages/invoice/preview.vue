<script setup lang="ts">
    import { useInvoice } from '~/composables/useInvoice'

    const { getItemTotal } = useInvoice()

    definePageMeta({
        layout: 'invoice'
    })

    const route = useRoute()

    const data = computed(() => {
        if (!route.query.invoice) {
            throw new Error('No invoice data found in query parameters.')
        }
        
        return JSON.parse(route.query.invoice as string)
    })

    const invoice = computed(() => data?.value.invoice)
    const totals = computed(() => data?.value.totals)

    const formatDate = (date: string | Date) => {
        return new Intl.DateTimeFormat('da-DK', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(date))
    }
</script>

<template>
    <section class="invoice-document">
        <header class="invoice-document--firm-customer">
            <div>
                <p>Dato: {{ formatDate(invoice?.details.created) }}</p>
                <p>Faktura Nr: {{ invoice?.details.number }}</p>
                <br>
                <p>{{ invoice?.customer.name }}</p>
                <p>{{ invoice?.customer.address}}</p>
                <p>{{ invoice?.customer.email}}</p>
                <p>{{ invoice?.customer.cvr}}</p>
            </div>
            <div>
                <h1>{{ invoice?.seller.name }}</h1>
                <p>{{ invoice?.seller.owner }}</p>
                <p>{{ invoice?.seller.address }}</p>
                <p>Tlf: {{ invoice?.seller.phone }}</p>
                <p>Email: {{ invoice?.seller.email }}</p>
                <p>CVR: {{ invoice?.seller.cvr }}</p>
            </div>
        </header>

        <article>
            <header>
                <h2>Vedr. {{ invoice?.details.heading }}</h2>
            </header>
            <table>
                <thead>
                    <tr>
                        <th>Vare</th>
                        <th>Antal</th>
                        <th>Pris</th>
                        <th>total</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(item) in invoice?.items">
                        <th>{{ item.name }}</th>
                        <td>{{ item.quantity }}</td>
                        <td>{{ item.unitPrice }} kr</td>
                        <td>{{ getItemTotal(item) }} kr</td>
                    </tr>
                </tbody>

                <tfoot v-if="!invoice?.tax.enabled">
                    <tr>
                        <th colspan="3">Pris</th>
                        <th>{{ totals?.subtotal }} kr</th>
                    </tr>
                </tfoot>

                <tfoot v-else>
                    <tr>
                        <th colspan="3">Pris eksl. moms</th>
                        <td>{{ totals?.subtotal }} kr</td>
                    </tr>
                    <tr>
                        <th colspan="3">Moms</th>
                        <td>{{ totals?.tax }} kr</td>
                    </tr>
                    <tr>
                        <th colspan="3">Pris incl. moms</th>
                        <th>{{ totals?.total }} kr</th>
                    </tr>
                </tfoot>
            </table>
        </article>

        <footer>
            <p>{{ invoice?.payment.terms }}</p>
            <p>{{ invoice?.payment.bank.name }} {{ invoice?.payment.bank.registrationNumber }} - {{ invoice?.payment.bank.accountNumber }}</p>
            <p>{{ invoice?.payment.reminder }}</p>
        </footer>
    </section>
</template>

<style lang="scss" scoped>
    .invoice-document {
        width: 100%;
        min-height: 100vh;
        padding: 3rem;
        display: grid;
        grid-template-rows: auto 1fr auto;
        gap: 3rem;
        background-color: white;

        &--firm-customer {
            display: grid;
            grid-template-columns: 1.5fr 2fr;
            gap: 1rem;
        }

        article {
            display: flex;
            flex-direction: column;
            gap: 1rem;

            table {

                th, td {
                    padding: .5rem;
                    text-align: center;
                }

                thead {
                    background-color: #0D0E10;
                    color: #FAFAFA;
                }

                tbody {
                    tr {
                        background-color: #c6c6c6;

                        &:nth-child(odd) {
                            background-color: #e2e2e2;
                        }  
                    }
                }
            }
        }
    }
</style>