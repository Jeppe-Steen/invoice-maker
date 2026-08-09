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
      terms: '',
      bank: '',
      reminder: '',
      price: 0,
      tax: 0,
      total: 0,
      currency: 'DKK',
      heading: '',
      useTax: true,
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

  const round2 = (value: number) => {
    return Math.round((value + Number.EPSILON) * 100) / 100
  }

  const subtotal = computed(() => {
    return round2(
      invoice.value.items.reduce((sum, item) => {
        return sum + Number(item.quantity) * Number(item.price)
      }, 0)
    )
  })

  const tax = computed(() => {
    return round2(subtotal.value * 0.25)
  })

  const total = computed(() => {
    return round2(subtotal.value + tax.value)
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

    if (profile.value) {
      applyProfile(profile.value)
    }

    await loadNextInvoiceNumber()
    
    localStorage.removeItem('invoice')
  }

  const sendInvoice = async (input: string) => {
    await $fetch('/api/send', {
        method: 'POST',
        body: {
          invoice: invoice.value,
          mail: input
        }
    })
  }

  const saveInvoice = async () => {
    invoice.value.invoiceDetails.price = subtotal.value
    invoice.value.invoiceDetails.tax = tax.value
    invoice.value.invoiceDetails.total = total.value

    await $fetch('/api/save', {
        method: 'POST',
        body: {
          invoice: invoice.value,
          subtotal: subtotal.value,
          tax: tax.value,
          total: total.value
        }
      })
  }

  const downloadInvoice = async () => {
    invoice.value.invoiceDetails.price = subtotal.value
    invoice.value.invoiceDetails.tax = tax.value
    invoice.value.invoiceDetails.total = total.value
    
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
    return round2(
      Number(item.price) * Number(item.quantity)
    )
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