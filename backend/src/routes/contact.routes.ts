import { Router } from 'express'
import { sendContact } from '../controllers/contact.controller.js'

export const contactRouter = Router()

contactRouter.post('/', sendContact)