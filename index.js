
import express from 'express'
import { userRouter } from './routes/user.routes.js'
import { tasksRouter } from './routes/tasks.routes.js'
import { newsRouter } from './routes/news.routes.js'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import { uploadRouter } from './routes/upload.routes.js'

const PORT = process.env.PORT || 8080



const app = express()


app.use(express.json())
app.use(cors())
dotenv.config()
app.use('/uploads', express.static('uploads'))
app.use('/upload', express.static('uploads/img'))
app.use(newsRouter)
app.use(userRouter)
app.use(tasksRouter)
app.use(uploadRouter)



const server = app.listen(PORT, () => {
    const { address, port } = server.address();
    console.log(`Сервер ${address} запущен порт ${PORT}`)
})
