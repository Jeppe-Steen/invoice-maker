<script setup lang="ts">
    import { useInvoice } from '~/composables/useInvoice'

    const route = useRoute()

    const {
        invoice: stateInvoice,
        getItemTotal,
    } = useInvoice()

    const invoice = computed(() => {
        if (route.query.invoice) {
            return JSON.parse(route.query.invoice as string)
        }

        return stateInvoice.value
    })

    definePageMeta({
        layout: 'invoice'
    })

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
                <p>Dato: {{ formatDate(invoice.invoiceDetails.created) }}</p>
                <p>Faktura Nr: {{ invoice.invoiceDetails.number }}</p>
                <br>
                <p>{{ invoice.customer.name }}</p>
                <p>{{ invoice.customer.address}}</p>
            </div>
            <div>
                <h1>{{ invoice.firm.name }}</h1>
                <p>{{ invoice.firm.owner }}</p>
                <p>{{ invoice.firm.address }}</p>
                <p>Tlf: {{ invoice.firm.phone }}</p>
                <p>Email: {{ invoice.firm.email }}</p>
                <p>CVR: {{ invoice.firm.cvr }}</p>
            </div>
        </header>

        <article>
            <header>
                <h2>Vedr. {{ invoice.invoiceDetails.heading }}</h2>
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
                    <tr v-for="(item) in invoice.items">
                        <th>{{ item.name }}</th>
                        <td>{{ item.quantity }}</td>
                        <td>{{ item.price }} {{ invoice.invoiceDetails.currency }}</td>
                        <td>{{ getItemTotal(item) }} {{ invoice.invoiceDetails.currency }}</td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <th colspan="3">Pris eksl. moms</th>
                        <td>{{ invoice.invoiceDetails.price  }} {{ invoice.invoiceDetails.currency }}</td>
                    </tr>
                    <tr>
                        <th colspan="3">Moms</th>
                        <td>{{ invoice.invoiceDetails.tax }} {{ invoice.invoiceDetails.currency }}</td>
                    </tr>
                    <tr>
                        <th colspan="3">Pris incl. moms</th>
                        <th>{{ invoice.invoiceDetails.total }} {{ invoice.invoiceDetails.currency }}</th>
                    </tr>
                </tfoot>
            </table>
        </article>

        <footer>
            <p>{{ invoice.invoiceDetails.terms }}</p>
            <p>{{ invoice.invoiceDetails.bank }}</p>
            <p>{{ invoice.invoiceDetails.reminder }}</p>
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