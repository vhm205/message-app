import { config }       from 'dotenv';
import express          from 'express';
import connectFlash     from 'connect-flash';
import connectDB        from './config/connectDB';
import configViewEngine from './config/viewEngine';
import configSession    from './config/session';
import initRoutes       from './routes/api.routes';

const app = express()

config()
connectDB()
configSession(app)
configViewEngine(app)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(connectFlash())

initRoutes(app)

const PORT = process.env.PORT || 1002
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
