import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user || user.is_anonymous) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Du skal være logget ind'
    })
  }

  const { invoice, totals } = body

  const { data, error } = await client
    .from('invoices')
    .insert({
      user_id: user.sub,

      invoice_number: invoice.details.number,

      invoice_date: invoice.details.created,
      due_date: invoice.details.showDueDate
        ? invoice.details.due
        : null,

      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,

      invoice_data: invoice,

      is_active: true
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Fakturanummeret findes allerede.'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return data
})