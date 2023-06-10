import {Router} from 'express'
import {quizController} from "../controller/quiz.controller.js";
export const quizRoutes = new Router()

quizRoutes.post('quiz/create', quizController.createQuiz);
quizRoutes.post('/quiz/answer/add', quizController.addAnswer);
