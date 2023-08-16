import express from 'express'
import { authController } from './auth.controller'
import { authMiddleware } from './auth.middleware'

const authRouter : express.Router = express.Router()

authRouter.post("/user", authMiddleware, authController.authOperations)

export { authRouter }