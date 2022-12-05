import express from 'express'
import UserController from '../Controllers/UserController.js'
import authMiddleware from './../middlewares/auth-middleware.js'


const router = express.Router()

router.post('/register',UserController.registerUser)
router.get('/activate/:link',UserController.activateAccount)
router.post('/login',UserController.loginUser)
router.get('/refresh_token',authMiddleware,UserController.refreshToken)
router.post('/update__profile',authMiddleware,UserController.updateProfile)



export default router