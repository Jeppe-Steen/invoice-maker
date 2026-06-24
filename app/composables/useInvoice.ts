// composables/useInvoice.ts

import { watch } from 'vue'

const defaultInvoice = () => ({
  invoiceDetails: {
        created: '',
        due: '',
        number: 0,
        terms: 'Betaling netto kontant',
        bank: 'Sparekassen Danmark 9070 - 1627436722',
        reminder: 'RYKKERGEBYR Kr 100. - pr gang plus 2% i renter',
        price: 0,
        tax: 0,
        total: 0, 
        currency: 'DKK',
        heading: '',
    },
    firm: {
        name: '',
        owner: '',
        address: '',
        phone: '',
        email: '',
        cvr: '',
    },
    customer: {
        name: '',
        address: '',
    },
    items: [
        { name: 'Test', quantity: 0, price: 0 }
    ],
})

export const useInvoice = () => {
  const invoice = useState('invoice', () => defaultInvoice());
  const initialized = useState('initialized', () => false);

  onMounted(() => {
    const savedInvoice = localStorage.getItem('invoice')

    if (savedInvoice) {
      invoice.value = JSON.parse(savedInvoice)
    }

    // sørg for watch kun én gang
    if (!initialized.value) {
      watch(
        invoice,
        (value) => {
          localStorage.setItem('invoice', JSON.stringify(value))
        },
        { deep: true }
      )

      initialized.value = true
    }
  })

  const addItem = () => {
    invoice.value.items.push({
      name: 'Ny vare',
      quantity: 1,
      price: 0
    })
  }

  const removeItem = (index: number) => {
    invoice.value.items.splice(index, 1)
  }

  const resetInvoice = () => {
    invoice.value = defaultInvoice()

    if (import.meta.client) {
      localStorage.removeItem('invoice')
    }
  }

  return {
    invoice,
    initialized,

    addItem,
    removeItem,

    resetInvoice,
  }
}