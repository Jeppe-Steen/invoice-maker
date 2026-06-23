// server/api/invoice/send.post.ts

import { Resend } from 'resend'
import puppeteer from 'puppeteer'

const resend = new Resend(process.env.RESEND_API_KEY)

export default defineEventHandler(async (event) => {
 const invoice = await readBody(event)

  const encodedInvoice = encodeURIComponent(
    JSON.stringify(invoice)
  )

  const browser = await puppeteer.launch()

  const page = await browser.newPage()

  await page.goto(
    `http://localhost:3000/invoice/preview?invoice=${encodedInvoice}`,
    {
      waitUntil: 'networkidle0'
    }
  )

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true
  })

  await browser.close()

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'jeppe-steen@live.dk',
    subject: `Faktura ${invoice.invoiceDetails.number}`,
    html: '<p>Vedhæftet finder du din faktura.</p>',
    attachments: [
      {
        filename: `faktura-${invoice.invoiceDetails.number}.pdf`,
        content: Buffer.from(pdf)
      }
    ]
  })

  return {
    success: true
  }
})