import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import notesRoutes from './routes/noteRoutes.js'


dotenv.config()
connectDB()
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended : true }))

// Authentication Routes 

app.use('/api/auth',authRoutes)

// User Routes 

app.use('/api/profile',userRoutes)

// Notes Routes 

app.use('/api/notes',notesRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT , ()=>{
    console.log(`Server running on port : ${PORT}`);
})