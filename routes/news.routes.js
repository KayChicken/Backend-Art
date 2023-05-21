import {Router} from 'express'
export const newsRouter = new Router()
import { newsController } from '../controller/news.controller.js'




tasksRouter.get('/news', newsController.getNews)
