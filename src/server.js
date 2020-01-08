import { config }       from 'dotenv';
import express          from 'express'
import connectDB        from './config/connectDB'
import configViewEngine from './config/viewEngine'
import initRoutes       from './routes/api.routes'

const app = express()

config()
connectDB()
configViewEngine(app)
initRoutes(app)

const PORT = process.env.PORT || 1002
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
