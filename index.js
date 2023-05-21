
import express from 'express'
import { userRouter } from './routes/user.routes.js'
import { tasksRouter } from './routes/tasks.routes.js'

const PORT = process.env.PORT || 8080



const app = express()
app.use(express.json())



app.use(userRouter)
app.use(tasksRouter)



app.listen(PORT, () => console.log('server is started'))