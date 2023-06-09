import {Router} from 'express'
export const newsRouter = new Router()
import { newsController } from '../controller/news.controller.js'
import { newsValidator } from '../validations/news.js'




newsRouter.get('/news/:page', newsController.getNews)
newsRouter.post('/news/create' , newsValidator,newsController.createNews)
newsRouter.delete('/news/delete', newsController.deleteNews)
newsRouter.post('/news/my' , newsController.myNews)