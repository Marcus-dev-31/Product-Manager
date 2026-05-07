import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { registerSchema, loginSchema } from '../schemas/auth.schema.js'

export async function register(req, res) {
    try {
        const data = registerSchema.parse(req.body)

        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        })

        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' })
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
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(201).json({ token, businessName: business.name })

    } catch (error) {
        console.error(error)
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: error.issues })
        }
        res.status(500).json({ error: 'Error del servidor' })
    }
}

export async function login(req, res) {
    try {
        const data = loginSchema.parse(req.body)

        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { business: true }
        })

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' })
        }

        const validPassword = await bcrypt.compare(data.password, user.password)

        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' })
        }

        const token = jwt.sign(
            { userId: user.id, businessId: user.businessId, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(200).json({ token, businessName: user.business.name })

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: error.issues })
        }
        res.status(500).json({ error: 'Error del servidor' })
    }
}