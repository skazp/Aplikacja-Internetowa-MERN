const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 6,
      maxlength: 20
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 40
    },
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', async function () {
  if(!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema)