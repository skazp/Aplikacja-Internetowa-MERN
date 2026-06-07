const jwt = require('jsonwebtoken')
const User = require('../models/User')
const validationResult = require('express-validator')

const genToken = (id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'1d'})
}

const register = async (req,res) => {
  const errors = validationResult(req)
  if(isEmpty(errors)){
    const {name, email, password} = req.body
    try{
      const conflict = await User.findOne({$or: [{email}, {name}]})
      if(conflict){
        return res.status(400).json({message:'User with this username or password already exists.'})
      }
      const user = await User.create({name,email,password})
      res.status(201).json({
        _id:user.id,
        name:user.name,
        emial:user.email,
        token:genToken(user._id)
      })
    }catch(error){
      res.status(500).json({message:'Server error', error: error.message})
    }
  }else{
    return res.status(400).json({errors:errors.array()})
  }
}

const login = async (req,res) => {
  const errors = validationResults(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }
  const{email,password} = req.body

  try{
    const user = await User.findOne({email})
    if(!user||!(await user.matchPassword(password))){
      return res.status(401).json({message:'Invalid email or password'})
    }
    res.json({
      _id:user._id,
      name:user.name,
      email:user.email,
      token: genToken(user._id),
    })
  }catch(error){
    res.status(500).json({message:'Server error', error: error.message})
  }
}

const getMe = async (req,res) => {
  res.json({
    _id:req.user._id,
    name:req.user.name,
    email:req.user.email,
  })
}

module.exports = {register,login,getMe}