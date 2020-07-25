const functions = require('firebase-functions')
const admin = require('firebase-admin')
const puppeteer = require('puppeteer')
const express = require('express')
admin.initializeApp(functions.config().firebase)
var fireStore = admin.firestore()
const app = express()

app.post('/favorites', async (req, res) => {
  const browser = await puppeteer.launch({
    // args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // headless: false, // ヘッドレスをオフに
    // slowMo: 100, // 動作を遅く
  })
  const page = await browser.newPage()
  const userAgent =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1'
  page.setUserAgent(userAgent)
  const url = req.body.url
  await page.setJavaScriptEnabled(true)
  await page.goto(url, { waitUntil: 'networkidle0' })

  const name = await getInnerText(await page.$$('span.section_h1-title-inner'))
  const priceStr = await getInnerText(await page.$$('.futureInfo_kakaku'))
  const managementFeeStr = await getInnerText(
    await page.$$('.gaiyoInfo_kanri .gaiyoInfo_text')
  )
  const renovationJackpotStr = await getInnerText(
    await page.$$('.gaiyoInfo_shuzen .gaiyoInfo_text')
  )
  const data = {
    name: name,
    price: getMoneyInNumbers(priceStr),
    managementFee: getMoneyInNumbers(managementFeeStr),
    renovationJackpot: getMoneyInNumbers(renovationJackpotStr),
    url: url,
  }
  console.log(JSON.stringify(data))

  await browser.close()

  // Firestore
  var dataRef = fireStore.collection('favorites')
  dataRef
    .add(data)
    .then(async (ref) => {
      console.log('Added document with ID: ', ref.id)
      return res.send('Finish !!')
    })
    .catch((err) => {
      res.send('ERROR HAPPENED.' + err)
      throw new Error('ERROR HAPPENED.' + err)
    })
})

const getInnerText = async (elem) => {
  return await (await elem[0].getProperty('innerText')).jsonValue()
}

const getMoneyInNumbers = (money) => {
  let money100_000_000Disit = 0
  let money10_000Disit = 0
  let money1Disit = 0
  let money100_000_000Splited = money.split('億')

  if (money100_000_000Splited.length === 2) {
    money100_000_000Disit = money100_000_000Splited[0]
    money10_000DisitSplited = money100_000_000Splited[1].split('万')
  } else {
    money10_000DisitSplited = money.split('万')
  }

  if (money10_000DisitSplited.length === 2) {
    money10_000Disit = money10_000DisitSplited[0]
    money1DisitSplited = money10_000DisitSplited[1].split('円')
  } else {
    money1DisitSplited = money.split('円')
  }

  if (money1DisitSplited.length === 2) {
    money1Disit = money1DisitSplited[0]
  }

  const moneyConvertedNumbers =
    money100_000_000Disit * 100000000 +
    money10_000Disit * 10000 +
    money1Disit * 1

  console.log(moneyConvertedNumbers)
  return moneyConvertedNumbers
}

const api = functions
  .region('asia-northeast1')
  .runWith({
    timeoutSeconds: 120,
    memory: '2GB',
  })
  .https.onRequest(app)
module.exports = { api }
