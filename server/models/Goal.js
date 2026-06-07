const mongoose = require('mongoose')

const stepSchema = new mongoose.Schema(
  {
    title:{
      type:String,
      required:true,
      maxlength:40
    },
    completed:{
      type:Boolean,
    },
  }
)

const goalSchema = new mongoose.Schema(
  {
    title:{
      type: String,
      required: true,
      maxlength: 40,
    },
    description:{
      type: String,
      maxlength: 100,
    },
    category:{
      type: String,
      enum: ['health','work','finance','hobby','other'],
    },
    deadline:{
      type: Date,
    },
    progress:{
      type: Number,
      min:0,
      max:100,
    },
    steps: [stepSchema],
    status: {
      type:String,
      enum: ['in-progress','completed','failed']
    },
  },
  {
    timestamps: true
  }
)

goalSchema.methods.updateProgress = function(){
  const completed = this.steps.filter((s) => s.completed).length
  this.progress = Math.round((completed/this.steps.length)*100)
}

module.exports = mongoose.model('Goal', goalSchema)