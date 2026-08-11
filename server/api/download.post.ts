import puppeteer from 'puppeteer'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const data = await readBody(event)

  const encodedData = encodeURIComponent(
    JSON.stringify(data)
  )

  const browser = await puppeteer.launch()

  const page = await browser.newPage()

  await page.goto(
    `${config.appUrl}/invoice/preview?invoice=${encodedData}`,
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

  return new Uint8Array(pdf)
})