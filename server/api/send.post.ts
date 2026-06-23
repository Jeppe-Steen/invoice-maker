// server/api/invoice/send.post.ts

import { Resend } from 'resend'
import { generateInvoicePdf } from '../utils/generateInvoice'

const resend = new Resend(process.env.RESEND_API_KEY)

export default defineEventHandler(async (event) => {
  const invoice = await readBody(event)

  const html = `
    <h1>Faktura</h1>
    <p>${invoice.customerName}</p>
  `

  const pdf = await generateInvoicePdf(html)

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: invoice.customerEmail,
    subject: 'Din faktura',
    html: '<p>Vedhæftet finder du din faktura.</p>',
    attachments: [
      {
        filename: 'faktura.pdf',
        content: Buffer.from(pdf)
      }
    ]
  })

  return {
    success: true
  }
})