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
      required: true,
      enum: ['health','work','finance','education','hobby','other'],
    },
    deadline:{
      type: Date,
      required: true,
    },
    progress:{
      required: true,
      type: Number,
      min:0,
      max:100,
    },
    steps: [stepSchema],
    status: {
      type:String,
      enum: ['in-progress','completed','failed'],
      default: 'in-progress',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true
  }
)

goalSchema.methods.updateProgress = function(){
  const completed = this.steps.filter((s) => s.completed).length
  this.progress = Math.round((completed/this.steps.length)*100)
  if(isNaN(this.progress)) this.progress = 0
}

module.exports = mongoose.model('Goal', goalSchema)