// composables/useInvoice.ts

import { watch } from 'vue'
import { useProfile } from '~/composables/useProfile'

const defaultInvoice = () => {
  const today = new Date()

  const dueDate = new Date(today)
  dueDate.setDate(dueDate.getDate() + 14)

  return {
    invoiceDetails: {
      created: today,
      due: dueDate,
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
      {
        name: 'Test',
        quantity: 0,
        price: 0,
      },
    ],
  }
}

export const useInvoice = () => {
  const invoice = useState('invoice', () => defaultInvoice());
  const initialized = useState('initialized', () => false);
  const supabase = useSupabaseClient()
  const { profile, loadProfile } = useProfile()

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

  const subtotal = computed(() => {
    return invoice.value.items.reduce((sum, item) => {
      return sum + Number(item.quantity) * Number(item.price)
    }, 0)
  })

  const tax = computed(() => {
    return subtotal.value * 0.25
  })

  const total = computed(() => {
    return subtotal.value + tax.value
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

  const resetInvoice = async () => {
    invoice.value = defaultInvoice()

    if (import.meta.client) {
      localStorage.removeItem('invoice')
    }

    await loadProfile()

    if (profile.value) {
      applyProfile(profile.value)
    }

    await loadNextInvoiceNumber()
  }
  
  const saveInvoice = async () => {
    const supabase = useSupabaseClient()

    //setting subtotal, tax and total for invoive
    invoice.value.invoiceDetails.price = subtotal.value
    invoice.value.invoiceDetails.tax = tax.value
    invoice.value.invoiceDetails.total = total.value

    //getting user
    const {
      data: { user }
    } = await supabase.auth.getUser()

    // if not user throw error
    if (!user || user.is_anonymous) {
      throw new Error('Du skal være logget ind')
    }

    // inserting in database
    const { data, error } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        invoice_number: invoice.value.invoiceDetails.number,
        customer_name: invoice.value.customer.name,
        invoice_date: invoice.value.invoiceDetails.created,
        due_date: invoice.value.invoiceDetails.due,
        subtotal: subtotal.value,
        vat: tax.value,
        total: total.value,
        status: 'draft',
        invoice: invoice.value
      })
      .select()
      .single()

    //if error, throw error
    if (error) {
      throw error
    }

    //The user needs to be able to make a new one or be sent to dashboard
    await resetInvoice()
  }

  const sendInvoice = async () => {
    console.log('sending!')

    // needs to open a modal with email input and a button which says 'if you send this will be marked as done and can't be edited again.


    // await $fetch('/api/send', {
    //     method: 'POST',
    //     body: invoice.value
    // })
  }

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

  const getItemTotal = (item: any) => {
    return Number(item.price) * Number(item.quantity)
  }

  return {
    invoice,
    initialized,
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
    sendInvoice,
    downloadInvoice,
  }
}