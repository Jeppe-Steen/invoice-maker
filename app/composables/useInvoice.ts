// composables/useInvoice.ts

import { watch } from 'vue'
import { useProfile } from '~/composables/useProfile'

const defaultInvoice = () => {
  const today = new Date()

  const dueDate = new Date(today)
  dueDate.setDate(dueDate.getDate() + 14)

  return {
    details: {
      number: 0,
      created: today,
      due: dueDate,
      showDueDate: true,
      heading: '',
    },

    seller: {
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
      email: '',
      cvr: '',
    },

    items: [
      {
        name: '',
        quantity: 1,
        unitPrice: 0,
      }
    ],

    tax: {
      enabled: true,
      rate: 25,
    },

    payment: {
      terms: '',

      bank: {
        name: '',
        registrationNumber: '',
        accountNumber: '',
      },

      reminder: '',
    }
  }
}

export const useInvoice = () => {
  const invoice = useState('invoice', () => defaultInvoice());
  const initialized = useState('initialized', () => false);
  const supabase = useSupabaseClient()

  const { profile } = useProfile()

  onMounted(() => {
    const savedInvoice = localStorage.getItem('invoice')

    if (savedInvoice) {
      invoice.value = JSON.parse(savedInvoice)
    }

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
      invoice.value.details.number = 1
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

    invoice.value.details.number = lastInvoice
      ? lastInvoice.invoice_number + 1
      : 1
  }

  const applyProfile = (profile: any) => {
    invoice.value.seller.name = profile.company_name
    invoice.value.seller.owner = profile.owner_name
    invoice.value.seller.address = profile.address
    invoice.value.seller.phone = profile.phone
    invoice.value.seller.email = profile.email
    invoice.value.seller.cvr = profile.cvr
    invoice.value.payment.bank.name = profile.bank_name
    invoice.value.payment.bank.registrationNumber = profile.bank_registration_number
    invoice.value.payment.bank.accountNumber = profile.bank_account_number
    invoice.value.payment.terms = profile.payment_terms
    invoice.value.payment.reminder = profile.reminder_text
  }

  const round2 = (value: number) => {
    return Math.round((value + Number.EPSILON) * 100) / 100
  }

  const subtotal = computed(() => {
    return round2(
      invoice.value.items.reduce((sum, item) => {
        return sum + Number(item.quantity) * Number(item.unitPrice)
      }, 0)
    )
  })

  const tax = computed(() => {
    if (!invoice.value.tax.enabled) {
      return 0
    }

    return round2(
      subtotal.value * (invoice.value.tax.rate / 100)
    )
  })

  const total = computed(() => {
    return round2(subtotal.value + tax.value)
  })

  const totals = computed(() => ({
    subtotal: subtotal.value,
    tax: tax.value,
    total: total.value
  }))

  const addItem = () => {
    invoice.value.items.push({
      name: '',
      quantity: 1,
      unitPrice: 0
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
        totals: totals.value,
        mail: input
      }
    })
  }

  const saveInvoice = async () => {

    await $fetch('/api/save', {
        method: 'POST',
        body: {
          invoice: invoice.value,
          totals: totals.value
        }
      })
  }

  const downloadInvoice = async (item: any) => {

    const response = await fetch('/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        invoice: item.invoice_data,
        totals: {
          subtotal: item.subtotal,
          tax: item.tax,
          total: item.total
        }
      })
    })

    const blob = await response.blob()

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `faktura-${item.invoice_number}.pdf`
    a.click()

    URL.revokeObjectURL(url)
  }

  const getItemTotal = (item: any) => {
    return round2(
      Number(item.unitPrice) * Number(item.quantity)
    )
  }

  return {
    invoice,
    initialized,

    subtotal,
    tax,
    total,
    totals,

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