const functions = require('firebase-functions')
const express = require('express')

const app = express()

app.get('/users', (req, res) => {
  // 本来はここでFireStoreとかからデータ取ってくるよ
  const users = [
    { id: 1, name: 'イリヤ' },
    { id: 2, name: '美遊' },
    { id: 3, name: 'クロエ' },
    { id: 4, name: 'オルタ' },
    { id: 5, name: 'マシュ' },
  ]

  // データを返却
  res.send(JSON.stringify(users))
})

const api = functions.https.region('asia-northeast1').onRequest(app)
module.exports = { api }
