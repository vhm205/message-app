import express from 'express'
import connectDB from './config/connectDB'
import ContactModel from './models/contact.model'

const app = express()
connectDB()

app.get('/', async (_, res) => {

    try {
        const item = {
            userId: '987654321',
            contactId: '123456789',
        }
        const contact = await ContactModel.createNew(item)
        res.json(contact)
    } catch (err) {
        console.error(err);
    }
})

const PORT = process.env.PORT || 1002
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
