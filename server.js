const express = require('express')
const { MongoClient } = require('mongodb')
require('dotenv').config()

const app = express()
const url = process.env.MONGODB_URL
let db

new MongoClient(url).connect().then((client) => {
    console.log('DB 연결 성공')
    db = client.db('StrengthHub')
}).catch((err) => {
    console.log(err)
})

app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
})

app.get('/', (req, res) => {
    res.send('반갑다')
})
