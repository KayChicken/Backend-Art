import {Router} from 'express'
export const tasksRouter = new Router()
import { tasksController } from '../controller/tasks.controller.js'




tasksRouter.get('/tasks/quiz',tasksController.getQuizes)
tasksRouter.get('/tasks/quiz/:id',tasksController.getOneQuiz)