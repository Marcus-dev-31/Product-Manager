import { Router } from 'express'
import { getTeam, getInviteCode, updateRole, removeUser } from '../controllers/team.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

export const teamRouter = Router()

teamRouter.get('/', authenticate, getTeam)
teamRouter.get('/invite-code', authenticate, getInviteCode)
teamRouter.patch('/:id/role', authenticate, updateRole)
teamRouter.delete('/:id', authenticate, removeUser)