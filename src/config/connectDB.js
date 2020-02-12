import mongoose from 'mongoose'
import bluebird from 'bluebird'

const connectDB = () => {
    mongoose.Promise = bluebird
    
    const URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOSTNAME}:${process.env.DB_PORT}/${process.env.DB_NAME}`

    return mongoose.connect(URI, { 
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
}

module.exports = connectDB
