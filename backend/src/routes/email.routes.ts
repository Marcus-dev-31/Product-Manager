import { Router } from 'express'
import { sendVerification, verifyEmail, forgotPassword, resetPassword } from '../controllers/email.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

export const emailRouter = Router()

emailRouter.post('/send-verification', authenticate, sendVerification)
emailRouter.get('/verify', verifyEmail)
emailRouter.post('/forgot-password', forgotPassword)
emailRouter.post('/reset-password', resetPassword)