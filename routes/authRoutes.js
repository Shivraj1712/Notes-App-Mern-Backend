import { loginUser, registerUser, forgotPassword , resetPassword } from '../controllers/authController.js'
import express from 'express'

const router = express.Router()

router.post('/login',loginUser)
router.post('/register',registerUser)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password/:token',resetPassword)

export default router 