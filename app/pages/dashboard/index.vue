<script setup>
import { useDashboard } from '~/composables/useDashboard';

const { loadDashboard, dashboard} = useDashboard()

definePageMeta({
    middleware: ['registered-user'],
    layout: 'dashboard'
})

const createInvoice = async () => {
    await navigateTo('/invoice/create')
}

const testFunction = () => {
    console.log('this is just a test');
}

const cards = [
    { title: 'Omæstning (denne måned)', value: dashboard?.value.stats.revenue || 'Loading...', subTitle: '+ 0% fra sidste måned' },
    { title: 'Fakturaer (denne måned)', value: dashboard.value.stats.invoiceCount || 'Loading...', subTitle: 'Total fakturaer' },
];

const quickActions = [
    { title: 'Opret faktura', subTitle: 'Kom hurtigt igang med en ny faktura', action: createInvoice },
    { title: 'Virksomhedsoplysninger', subTitle: 'Rediger dine virksomhedsoplysninger', action: testFunction },
    { title: 'Download seneste faktura', subTitle: 'Download PDF af seneste faktura', action: testFunction },
]

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
                ICON
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
            
            <UiCard v-for="card in quickActions" :title="card.title" :subTitle="card.subTitle" clickable @click="card.action?.()">
                <template #icon>
                    ICON
                </template>
            </UiCard>
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
            height: fit-content;
            gap: 2rem;
        }

        &--invoice-actions {
            display: grid;
            grid-template-columns: 1fr .6fr;
            gap: 2rem;
            width: 100%;
            height: fit-content;

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