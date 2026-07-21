<script setup lang="ts">
import { useInvoice } from '~/composables/useInvoice';
import { useProfile } from '~/composables/useProfile';
import { useAuth } from '~/composables/useAuth';
import SaveInvoicePage from '~/components/dialogs/saveInvoice.vue';
import ResetInvoicePage from '~/components/dialogs/resetInvoice.vue';

const dialog = useDialog();

const { 
    invoice,
    subtotal, 
    tax, 
    total, 
    getItemTotal,
    addItem, 
    removeItem, 
    resetInvoice, 
    applyProfile, 
    loadNextInvoiceNumber, 
    saveInvoice,
    downloadInvoice,
} = useInvoice()

const { profile, loadProfile } = useProfile()
const { isRegisteredUser, isAnonymous } = useAuth()

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

const handleSave = async () => {
    const result: any = await dialog.open(SaveInvoicePage)
    
    switch(result?.value) {
        case 'save':
            await saveInvoice()
            await resetInvoice()
            return  
        case 'download':
            await saveInvoice()
            await downloadInvoice()
            await resetInvoice()
            return   
        case 'cancle':
            dialog.close()
            return   
    }
}
const handleReset = async () => {
    const result: any = await dialog.open(ResetInvoicePage)

     switch(result?.value) {
        case 'reset':
            await resetInvoice()
            return
        case 'cancle':
            dialog.close()
            return
     }
}
const handleDownload = async () => {
   await downloadInvoice()
}

//DONE!
const buttons: any = computed(() => [
    { label: 'Ny faktura', type: 'secondary', show: true, action: handleReset},
    { label: 'Gem', show: isRegisteredUser.value, action: handleSave },
    { label: 'Download', show: isAnonymous.value, action: handleDownload },
].filter(item => item.show ?? true));

</script>

<template>
    <UiHeader>
        <template #title>
            <h1>Opret faktura</h1>
        </template>
    </UiHeader>

    <section class="btns-wrapper">
        <UiButton
            v-for="btn in buttons"
            :key="btn.label"
            :label="btn.label"
            :type="btn.type"
            :show="btn.show"
            @click="btn.action?.()"
        />
    </section>

    <UiForm class="invoice-fields">
        <UiCard shadow rounded>
            <UiHeader>
                <template #title>
                    <h2>Kunde oplysninger:</h2>
                </template>
            </UiHeader>
        
            <UiInput name="invoiceNumber" label="Faktura nr:" type="number" placeholder="Fx. 100" v-model="invoice.invoiceDetails.number" rounded/>
            <UiInput name="customerName" label="Kundens navn:" placeholder="Fx. John Doe" v-model="invoice.customer.name" rounded/>
            <UiInput name="customerAddress" label="Kundens adresse:" placeholder="Fx. Vesterbro 1, 9000 Aalborg" v-model="invoice.customer.address" rounded/>
            <UiInput name="invoiceHeading" label="Vedr:" placeholder="Fx. Renovering" v-model="invoice.invoiceDetails.heading" rounded/>
        </UiCard>

        <UiCard rounded shadow>
            <UiHeader>
                <template #title>
                    <h2>Virksomheds oplysninger:</h2>
                </template>
            </UiHeader>

            <UiInput name="firmName" label="Virksomheds navn:" placeholder="Fx. Min butik" v-model="invoice.firm.name" rounded/>
            <UiInput name="firmOwner" label="Virksomheds ejer:" placeholder="Fx. John Doe" v-model="invoice.firm.owner" rounded/>
            <UiInput name="firmAddress" label="Virksomheds adresse:" placeholder="Fx. Vesterbro 2, 9000 Aalborg" v-model="invoice.firm.address" rounded/>
            <UiInput name="firmPhone" label="Virksomheds telefon nr.:" placeholder="Fx. 10101010" v-model="invoice.firm.phone" rounded/>
            <UiInput name="firmEmail" label="Virksomheds email:" placeholder="Fx. john.doe@mail.com" v-model="invoice.firm.email" rounded/>
            <UiInput name="firmCVR" label="Virksomheds CVR:" placeholder="Fx. 10101010" v-model="invoice.firm.cvr" rounded/>

            <UiHeader>
                <template #title>
                    <h3>Ekstra felter:</h3>
                </template>
            </UiHeader>
                <UiInput name="firmTerms" placeholder="Fx. Betaling netto kontant" v-model="invoice.invoiceDetails.terms" rounded/>
                <UiInput name="firmBank" placeholder="Fx. Sparekassen Danmark 0000 - 0000000000" v-model="invoice.invoiceDetails.bank" rounded/>
                <UiInput name="firmReminder" placeholder="Fx. RYKKERGEBYR Kr 100. - pr gang plus 2% i renter" v-model="invoice.invoiceDetails.reminder" rounded/>
        </UiCard>

        <UiCard shadow rounded class="invoice-fields--items">
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
                        <td colspan="1"><UiInput name="itemName" placeholder="Fx. arbejdstimer" v-model="invoice.items[itemIndex]!.name" transparent/></td>
                        <td colspan="1"><UiInput name="itemCount" placeholder="Fx. 10" type="number" v-model="invoice.items[itemIndex]!.quantity" transparent/></td>
                        <td colspan="1"><UiInput name="itemPrice" placeholder="Fx. 100" type="number" v-model="invoice.items[itemIndex]!.price" transparent/></td>
                        <td colspan="1">{{ getItemTotal(item) }} {{ invoice.invoiceDetails.currency }}</td>
                        <td colspan="1"> <UiButton label="X" @click="removeItem(itemIndex)" type="danger" size="medium"/></td>
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
        </UiCard>
    </UiForm>
</template>

<style lang="scss" scoped>
    .btns-wrapper {
        display: flex;
        flex-direction: row;
        gap: 1rem;
    }

    .invoice-fields {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-areas: 
            'customer firm'
            'items items'
        ;
        gap: 2rem;


        &--items { 
            grid-area: items;

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