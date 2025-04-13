const express = require('express')
const { MongoClient } = require('mongodb')
require('dotenv').config()

const app = express()
const url = process.env.MONGODB_URL
let db

const cors = require('cors');
app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 파싱

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

app.post('/register', async (req, res) => {
    try {
        const { username, password, nickname, email } = req.body;
        const newUser = {
            user_id: username,
            name: nickname,
            email: email,
            password: password,
            role: 'USER',              // 기본값
            userPlanType: 'BEGINNER'   // 기본값
        };

        const result = await db.collection('user').insertOne(newUser);
        res.status(200).json({ message: '등록 완료', insertedId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류' });
    }
});