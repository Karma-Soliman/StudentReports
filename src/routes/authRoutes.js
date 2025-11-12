import express from 'express'
import * as auth from '../controllers/authenController.js'
import { verifyToken } from '../middleware/authen.js'

const router = express.Router()

router.post('/register', auth.register)
router.post('/login', auth.login)
router.get('/me', verifyToken, auth.getCurrentUser)

export default router