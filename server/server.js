const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/database')

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req,res) => res.json({message:'api dziala'}))

const PORT = process.env.PORT
app.listen(PORT, ()=>console.log(`Server is running on port: ${PORT}`))