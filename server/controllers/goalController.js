const {validationResult} = require('express-validator')
const Goal = require('../models/Goal')

const getGoals = async (req,res) => {
  try{
    const{category,status} = req.query
    const filter = {user: req.user._id}
    if(category) filter.category = category
    if(status) filter.status = status

    const goals = await Goal.find(filter).sort({createdAt:-1})
    res.json(goals)
  }catch(error){
    res.status(500).json({message:'Server error',error:error.message})
  }
}

const getGoalById = async (req,res) => {
  try{
    const goal = await Goal.findById(req.params.id)

    if(!goal){
      return res.status(404).json({message:'Goal not found'})
    }

    if(goal.user.toString() != req.user._id.toString()){
      return res.status(403).json({message:'Access denied'})
    }

    res.json(goal)
  }catch(error){
    res.status(500).json({message:'Server error', error:error.message})
  }
}

const createGoal = async (req,res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }

  const {title, description, category, deadline, steps} = req.body

  try{
    const goal = new Goal({
      user:req.user._id,
      title: title,
      description: description,
      category: category,
      deadline: deadline,
      steps: steps
    })

    goal.updateProgress()
    await goal.save()

    res.status(201).json(goal)
  }catch(error){
    console.log(error)
    res.status(500).json({message:'Server error', error:error.message})
  }
}

const updateGoal = async (req,res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }

  const {title, description, category, deadline, steps, progress, status} = req.body

  try{
    const goal = await Goal.findById(req.params.id)
    if(!goal){
      return res.status(404).json({message:'Goal not found'})
    }

    if(goal.user.toString() != req.user._id.toString()){
      return res.status(403).json({message:'Access denied'})
    }

    if(title != undefined) goal.title = title
    if(description != undefined) goal.description = description
    if(category != undefined) goal.category = category
    if(deadline != undefined) goal.deadline = deadline
    if(steps != undefined){
      goal.steps = steps
      goal.updateProgress()
    }
    if(status != undefined) goal.status = status

    if(goal.progress === 100){
      goal.status = 'completed'
    }

    const updatedGoal = await goal.save()
    res.json(updatedGoal)
  }catch(error){
    res.status(500).json({message:'Server error', error:error.message})
  }
}

const deleteGoal = async (req,res) => {
  try{
    const goal = await Goal.findById(req.params.id)

    if(!goal){
      return res.status(404).json({message:'Goal not found'})
    }

    if(goal.user.toString() != req.user._id.toString()){
      return res.status(403).json({message:'Access denied'})
    }
    
    await goal.deleteOne()
    res.json({message:"Goal deleted"})
  }catch(error){
    res.status(500).json({message:'Server error', error:error.message})
  }
}

module.exports = {getGoals, getGoalById, createGoal, updateGoal, deleteGoal}