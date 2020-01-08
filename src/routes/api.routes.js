import express from "express";
import { home, auth } from "../controllers/index";

const router = express.Router()

const initRoutes = app => {
    router.get('/', home.homeController)
    router.get('/login', auth.loginController)

    return app.use('/', router)
}

module.exports = initRoutes
