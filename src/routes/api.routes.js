import express from "express";
import { authValidate } from '../validation/index';
import { home, auth } from "../controllers/index";

const router = express.Router()

const initRoutes = app => {
    router.get('/', home.getHome)
    router.get('/login', auth.getLogin)
    router.post('/register', authValidate.register, authValidate.register, auth.postRegister)
    router.get('/verify/:token', auth.verifyAccount)

    return app.use('/', router)
}

module.exports = initRoutes
