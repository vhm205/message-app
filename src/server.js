import express from 'express'
import connectDB from './config/connectDB'
import configViewEngine from './config/viewEngine';

const app = express()

connectDB()
configViewEngine(app)

app.get('/', async (_, res) => {
    res.render('main/master')
})

app.get('/login', async (_, res) => {
    res.render('auth/loginRegister')
})

const PORT = process.env.PORT || 1002
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
