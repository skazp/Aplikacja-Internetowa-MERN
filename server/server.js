const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/database')
const authRoutes = require('./routes/authRoutes')
const goalRoutes = require('./routes/goalRoutes')

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req,res) => res.json({message:'api dziala'}))

app.use('/api/auth',authRoutes)
app.use('/api/goal',goalRoutes)

const PORT = process.env.PORT
app.listen(PORT, ()=>console.log(`Server is running on port: ${PORT}`))