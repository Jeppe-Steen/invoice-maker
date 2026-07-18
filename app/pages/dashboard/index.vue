<script setup>
import { useDashboard } from '~/composables/useDashboard';
import { useInvoice } from '~/composables/useInvoice';

const { loadDashboard, dashboard} = useDashboard()
const { invoice, downloadInvoice, resetInvoice} = useInvoice()

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
    { title: 'Omæstning (denne måned)', value: dashboard?.value.stats.revenue + ' kr' || 'Loading...', icon: { name: 'document', size: 30, backgroundSize: 45, color: '#5C32E6', background: '#5C32E630' } },
    { title: 'Fakturaer (denne måned)', value: dashboard?.value.stats.invoiceCount + ' stk' || 'Loading...', icon: { name: 'check', size: 30, backgroundSize: 45, color: '#29781F', background: '#29781F30' } },
];

const quickActions = [
    { title: 'Opret faktura', subTitle: 'Kom hurtigt igang med en ny faktura', action: createInvoice, icon: { name: 'pen', size: 30, backgroundSize: 45, color: '#5C32E6', background: '#5C32E630' } },
    { title: 'Virksomhedsoplysninger', subTitle: 'Rediger dine virksomhedsoplysninger', action: testFunction, icon: { name: 'shop', size: 30, backgroundSize: 45, color: '#29781F', background: '#29781F30' } },
    { title: 'Download seneste faktura', subTitle: 'Download PDF af seneste faktura', action: testFunction, icon: { name: 'download', size: 30, backgroundSize: 45, color: '#F5D95B', background: '#F5D95B30' } },
]

onMounted(async () => {
    await loadDashboard();
})

const download = async (item) => {
    invoice.value = item.invoice;
    await downloadInvoice();
    await resetInvoice();
}

</script>

<template>
    <div class="header">
        <UiHeader>
            <template #subtitle>
                <h1>God eftermiddag, Jeppe!</h1>
            </template>
            <template #title>
                <p>Her er et overblik over din forretning og dine fakturaer</p>
            </template>
        </UiHeader>

        <span>
            <UiButton label="Opret ny faktura" to="/invoice/create"/>
            <p>Hurtigt, nemt og professionelt</p>
        </span>
    </div>

    <section class="overview">
        <UiCard v-for="card in cards" shadow rounded>
            <span class="overview--card">
                <UiIcon :name="card.icon.name" :size="card.icon.size" :backgroundSize="card.icon.backgroundSize" :color="card.icon.color" :background="card.icon.background" rounded/>
                <UiHeader>
                    <template #subtitle>
                        <strong>{{ card.title }}</strong>
                    </template>
                    <template #title>
                        <p>{{ card.value }}</p>
                    </template>
                </UiHeader>
            </span>
        </UiCard>
    </section>

    <section class="invoice-actions">
        <UiCard rounded shadow>
            <span class="invoices">
                <div class="invoices--header">
                    <UiHeader>
                        <template #title>
                            <h3>Seneste fakturaer</h3>
                        </template>
                    </UiHeader>
                    
                    <UiButton label="Se alle fakturaer" />
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Nr.</th>
                            <th>Kunde</th>
                            <th>Dato</th>
                            <th>Beløb</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="invoice in dashboard.latestInvoices">
                            <th># {{ invoice.invoice_number }}</th>
                            <td>{{ invoice.customer_name }}</td>
                            <td>{{ invoice.invoice_date }}</td>
                            <td>{{ invoice.total }} DKK</td>
                            <td>{{ invoice.status }}</td>
                            <td><UiButton label="Download" @click="download(invoice)"/></td>
                        </tr>
                    </tbody>
                </table>
            </span>
        </UiCard>

        <UiCard shadow rounded>
            <UiHeader>
                <template #title>
                    <h3>Hurtige handlinger</h3>
                </template>
            </UiHeader>
            
            <UiCard v-for="card in quickActions" shadow rounded @click="card.action?.()" class="clickable">
                <span class="actions--card">
                    <UiIcon :name="card.icon.name" :size="card.icon.size" :backgroundSize="card.icon.backgroundSize" :color="card.icon.color" :background="card.icon.background" rounded/>
                    <UiHeader>
                        <template #subtitle>
                            <strong>{{ card.title }}</strong>
                        </template>
                        <template #title>
                            <p>{{ card.subTitle }}</p>
                        </template>
                    </UiHeader>
                </span>
            </UiCard>
        </UiCard>
    </section>
</template>

<style lang="scss" scoped>
    .header {
        width: 100%;
        height: 100px;

        display: grid;
        grid-template-columns: 1fr .2fr;
        align-items: center;

        span {
            display: flex;
            flex-direction: column;
            gap: .5rem;
        }
    }

    .overview {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        width: 100%;
        height: fit-content;
        gap: 2rem;

        &--card {
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: .3fr 1fr;
            gap: 1rem;
        }
    }

    .invoice-actions {
        display: grid;
        grid-template-columns: 1fr .5fr;
        gap: 2rem;
        width: 100%;
        height: fit-content;

        .invoices { 
            display: flex;
            flex-direction: column;
            gap: 1rem;

            &--header {
                display: grid;
                gap: 1rem;
                grid-template-columns: 1fr .3fr;
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
            &--card {
                width: 100%;
                height: 100%;
                display: grid;
                grid-template-columns: .3fr 1fr;
                gap: 1rem;
            }
        }
    }

    .clickable {
        cursor: pointer;
    }
</style>