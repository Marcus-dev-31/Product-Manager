import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { registerSchema, loginSchema, RegisterInput, LoginInput } from '../schemas/auth.schema.js'
import { AuthRequest } from '../middleware/auth.middleware.js'
import { ZodError } from 'zod'

export async function register(req: AuthRequest, res: Response): Promise<void> {
    try {
        const data: RegisterInput = registerSchema.parse(req.body)

        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        })

        if (existingUser) {
            res.status(400).json({ error: 'El email ya está registrado' })
            return
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)

        const business = await prisma.business.create({
            data: {
                name: data.businessName,
                users: {
                    create: {
                        email: data.email,
                        password: hashedPassword,
                        role: 'ADMIN'
                    }
                }
            },
            include: { users: true }
        })

        const user = business.users[0]

        const token = jwt.sign(
            { userId: user.id, businessId: business.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        )

        res.status(201).json({ token, businessName: business.name })

    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ error: error.issues })
            return
        }
        res.status(500).json({ error: 'Error del servidor' })
    }
}

export async function login(req: AuthRequest, res: Response): Promise<void> {
    try {
        const data: LoginInput = loginSchema.parse(req.body)

        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { business: true }
        })

        if (!user) {
            res.status(401).json({ error: 'Credenciales inválidas' })
            return
        }

        const validPassword = await bcrypt.compare(data.password, user.password)

        if (!validPassword) {
            res.status(401).json({ error: 'Credenciales inválidas' })
            return
        }

        const token = jwt.sign(
            { userId: user.id, businessId: user.businessId, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        )

        res.status(200).json({ token, businessName: user.business.name })

    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ error: error.issues })
            return
        }
        res.status(500).json({ error: 'Error del servidor' })
    }
}