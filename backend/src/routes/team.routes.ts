import { Router } from 'express'
import { getTeam, getInviteCode, updateRole, removeUser } from '../controllers/team.controller.js'
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js'

export const teamRouter = Router()

teamRouter.get('/', authenticate, requireAdmin, getTeam)
teamRouter.get('/invite-code', authenticate, requireAdmin, getInviteCode)
teamRouter.patch('/:id/role', authenticate, requireAdmin, updateRole)
teamRouter.delete('/:id', authenticate, requireAdmin, removeUser)