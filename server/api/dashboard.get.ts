// server/api/dashboard.get.ts

import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    const userId = user.sub

    // Seneste fakturaer
    const { data: invoices } = await client
        .from('invoices')
        .select(`
            id,
            invoice_number,
            customer_name,
            invoice_date,
            total,
            status,
            invoice
        `)
        .order('created_at', { ascending: false })
        .limit(5)

    // Alle fakturaer til statistik
    const { data: allInvoices } = await client
        .from('invoices')
        .select(`
            total,
            status
        `)

    const revenue =
        allInvoices
            ?.filter(i => i.status === 'send')
            .reduce((sum, i) => sum + Number(i.total), 0) ?? 0

    // const pending =
    //     allInvoices?.filter(i => i.status === 'pending').length ?? 0

    // const paid =
    //     allInvoices?.filter(i => i.status === 'paid').length ?? 0

    return {
        latestInvoices: invoices,
        stats: {
            revenue,
            invoiceCount: allInvoices?.length ?? 0,
        }
    }
})