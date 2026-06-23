import puppeteer from 'puppeteer'

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

    setHeader(event, 'Content-Type', 'application/pdf')
    //setHeader(event, 'Content-Length', pdf.length.toString())

  return new Uint8Array(pdf)
})