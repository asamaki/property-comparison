const functions = require('firebase-functions')
const admin = require('firebase-admin')
const puppeteer = require('puppeteer')
const express = require('express')
admin.initializeApp(functions.config().firebase)
var fireStore = admin.firestore()

const app = express()

app.add('/favorites', async (req, res) => {
  const browser = await puppeteer.launch({
    //args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // headless: false, // ヘッドレスをオフに
    // slowMo: 100, // 動作を遅く
  })
  const page = await browser.newPage()
  const userAgent =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1'
  page.setUserAgent(userAgent)
  const url =
    'https://suumo.jp/ms/chuko/tokyo/sc_edogawa/nc_94207822/?suit=STkr20180612200'
  await page.setJavaScriptEnabled(true)
  await page.goto(url, { waitUntil: 'networkidle0' })

  const name = await getInnerText(await page.$$('span.section_h1-title-inner'))
  const price = await getInnerText(await page.$$('.futureInfo_kakaku'))
  const managementFee = await getInnerText(
    await page.$$('.gaiyoInfo_kanri .gaiyoInfo_text')
  )
  const renovationJackpot = await getInnerText(
    await page.$$('.gaiyoInfo_shuzen .gaiyoInfo_text')
  )
  const data = {
    name: name,
    price: price,
    managementFee: managementFee,
    renovationJackpot: renovationJackpot,
    url: url,
  }
  console.log(JSON.stringify(data))

  await browser.close()

  // Firestore
  var dataRef = fireStore.collection('favorites')
  dataRef
    .add({
      data,
    })
    .then(async (ref) => {
      console.log('Added document with ID: ', ref.id)
      return res.send('Finish !!')
    })
    .catch((err) => {
      res.send('ERROR HAPPENED.' + err)
      throw new Error('ERROR HAPPENED.')
    })

  //res.send('Finish !!')
})

const getInnerText = async (elem) => {
  return await (await elem[0].getProperty('innerText')).jsonValue()
}

const api = functions
  .region('asia-northeast1')
  .runWith({
    timeoutSeconds: 120,
    memory: '512MB',
  })
  .https.onRequest(app)
module.exports = { api }
