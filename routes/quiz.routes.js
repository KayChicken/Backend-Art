import {Router} from 'express'
export const quizRoutes = new Router()
const quizController = require('../controller/quiz.controller.js')

quizRoutes.post('quiz/create', quizController.createQuiz);
quizRoutes.post('/quiz/answer/add', quizController.addAnswer);
