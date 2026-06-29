<script setup>
import UiCard from '~/components/newUiComponents/UiCard.vue';
import { useDashboard } from '~/composables/useDashboard';

const { loadDashboard, dashboard} = useDashboard()

definePageMeta({
    middleware: ['registered-user'],
    layout: 'dashboard'
})

const cards = [
    { title: 'Omæstning (denne måned)', value: dashboard?.value.stats.revenue, subTitle: '+ 0% fra sidste måned' },
    { title: 'Fakturaer (denne måned)', value: dashboard?.value.stats.invoiceCount, subTitle: 'Total fakturaer' },
];


onMounted(async () => {
    await loadDashboard();
})


</script>

<template>
    <header class="dashboard--header">
        <span>
            <h1>God eftermiddag, Jeppe!</h1>
            <p>Her er et overblik over din forretning og dine fakturaer</p>
        </span>
        <span>
            <UiButton label="+ Opret ny faktura" size="big" />
            <p>Hurtigt, nemt og professionelt</p>
        </span>
    </header>

    <section class="dashboard--overview">
        <UiCard v-for="card in cards" :title="card.title" :value="card.value" :subTitle="card.subTitle">
            <template #icon>
                ICON HERE
            </template>
        </UiCard>
    </section>

    <section class="dashboard--invoice-actions">
        <article class="invoices">
            <header>
                <h3>Seneste fakturaer</h3>
                <UiButton label="Se alle fakturaer" styling="link" />
            </header>

            <table>
                <thead>
                    <tr>
                        <th>Nr.</th>
                        <th>Kunde</th>
                        <th>Dato</th>
                        <th>Beløb</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="invoice in dashboard.latestInvoices">
                        <th># {{ invoice.invoice_number }}</th>
                        <td>{{ invoice.customer_name }}</td>
                        <td>{{ invoice.invoice_date }}</td>
                        <td>{{ invoice.total }} DKK</td>
                        <td>{{ invoice.status }}</td>
                    </tr>
                </tbody>
            </table>
        </article>

        <article class="actions">
            <header>
                <h3>Hurtige handlinger</h3>
            </header>
        </article>
    </section>
</template>

<style lang="scss" scoped>
    .dashboard {
        &--header {
            width: 100%;
            height: 100px;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            span {
                display: flex;
                flex-direction: column;
                gap: .5rem;
            }
        }

        &--overview {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            width: 100%;
            height: 150px;
            gap: 2rem;
        }

        &--invoice-actions {
            display: grid;
            grid-template-columns: 1fr .5fr;
            gap: 2rem;
            width: 100%;
            height: 50vh;

            .invoices { 
                padding: 20px;
                background-color: white;
                box-shadow: 2px 2px 10px #00000025;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                gap: 1rem;

                header {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                }

                table {
                    td, th {
                        padding: 10px;
                    }
                    thead {
                        text-align: left;
                    }

                    tbody {
                        text-align: left;
                    }
                }
            }
            .actions {
                padding: 20px;
                background-color: white;
                box-shadow: 2px 2px 10px #00000025;
                border-radius: 10px;
                gap: 1rem;
                display: flex;
                flex-direction: column;
            }
        }
    }
</style>