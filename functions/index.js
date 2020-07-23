const functions = require('firebase-functions')
const express = require('express')

const app = express()

app.get('/users', async (req, res) => {
  const puppeteer = require('puppeteer')

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()

  await page.goto('https://www.google.com/', { waitUntil: 'networkidle0' })

  const content = await page.content()
  browser.close()

  // データを返却
  res.send(JSON.stringify(content))
})

const api = functions.region('asia-northeast1').https.onRequest(app)
module.exports = { api }
