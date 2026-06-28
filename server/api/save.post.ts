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

    const { invoice, subtotal, tax, total } = body

    const { data, error } = await client
        .from('invoices')
        .insert({
            user_id: user.sub,
            invoice_number: invoice.invoiceDetails.number,
            customer_name: invoice.customer.name,
            invoice_date: invoice.invoiceDetails.created,
            due_date: invoice.invoiceDetails.due,
            subtotal,
            vat: tax,
            total,
            status: 'saved',
            invoice,
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