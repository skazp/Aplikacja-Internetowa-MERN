const express = require('express')
const router = express.Router()
const {body} = require('express-validator')
const {register,login,getMe} = require('../controllers/authController')
const {protect} = require('../middleware/authMiddleware')

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Username required').isLength({min:6, max:20}).withMessage('Username must be between 6-20 characters'),
  body('email').notEmpty().withMessage('Email required').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').isLength({min:6,max:40}).withMessage('Password must be between 6-40 characters')
]

const loginValidation = [
  body('email').notEmpty().withMessage('Email required').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password required')
]

router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)
router.get('/me', protect, getMe)

module.exports = router