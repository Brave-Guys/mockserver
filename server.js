const express = require('express')
const { MongoClient } = require('mongodb')
require('dotenv').config()

const app = express()
const url = process.env.MONGODB_URL
let db

const cors = require('cors');
app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 파싱

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'secretkey';

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

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await db.collection('user').findOne({ user_id: username });

        if (!user) {
            return res.status(401).json({ message: '존재하지 않는 계정입니다.' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                user_id: user.user_id,
                role: user.role,
            },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: '로그인 성공',
            token: token,
            user: {
                user_id: user.user_id,
                name: user.name,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류' });
    }
});