const express = require('express')
const router = express.Router()
const {body} = require('express-validator')
const {protect} = require('../middleware/authMiddleware')
const {getGoals, getGoalById, createGoal, updateGoal, deleteGoal} = require('../controllers/goalController')

const goalValidation = [
  body('title').trim().notEmpty().withMessage('Title required').isLength({max:40}).withMessage('Title must be below 40 characters'),
  body('description').optional().isLength({max:100}).withMessage('Description must be below 100 characters'),
  body('category').isIn(['health','work','finance','education','hobby','other']).withMessage('Invalid category'),
  body('deadline').isISO8601().withMessage('Invalid data format'),
  body('progress').optional().isInt({min:0,max:100}).withMessage('Progress must be between 0-100%'),
  body('steps').isArray().withMessage('Steps must be passed as an array'),
  body('steps.*.title').trim().notEmpty().withMessage('Every step must have a title'),
  body('steps.*.completed').isBoolean().withMessage('Every step must have a completion value')
]

router.use(protect)

router.route('/').get(getGoals).post(goalValidation, createGoal)

router.route('/:id').get(getGoalById).put(goalValidation, updateGoal).delete(deleteGoal)

module.exports = router