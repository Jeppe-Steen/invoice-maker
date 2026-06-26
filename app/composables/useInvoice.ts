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
  const supabase = useSupabaseClient()

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

  const loadNextInvoiceNumber = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user || user.is_anonymous) {
      invoice.value.invoiceDetails.number = 1
      return
    }

    const { data, error } = await supabase
      .from('invoices')
      .select('invoice_number')
      .eq('user_id', user.id)
      .order('invoice_number', { ascending: false })
      .limit(1)
      .maybeSingle()

    const lastInvoice = data as { invoice_number: number } | null

    if (error) {
      console.error(error)
      return
    }

    invoice.value.invoiceDetails.number = lastInvoice
      ? lastInvoice.invoice_number + 1
      : 1
  }
  const applyProfile = (profile: any) => {
    invoice.value.firm.name = profile.company_name
    invoice.value.firm.owner = profile.owner_name
    invoice.value.firm.address = profile.address
    invoice.value.firm.phone = profile.phone
    invoice.value.firm.email = profile.email
    invoice.value.firm.cvr = profile.cvr
    invoice.value.invoiceDetails.terms = profile.terms
    invoice.value.invoiceDetails.bank = profile.bank
    invoice.value.invoiceDetails.reminder = profile.reminder
  }
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
    applyProfile,
    loadNextInvoiceNumber
  }
}