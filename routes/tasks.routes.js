import {Router} from 'express'
export const tasksRouter = new Router()
import { tasksController } from '../controller/tasks.controller.js'
import checkAuth from '../utils/checkAuth.js'




tasksRouter.get('/tasks/quiz',checkAuth,tasksController.getQuizes)
tasksRouter.get('/tasks/quiz/:id',checkAuth,tasksController.getOneQuiz)