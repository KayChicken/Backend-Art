import {Router} from 'express'
export const quizRoutes = new Router()
import {quizController} from "../controller/quiz.controller.js";

quizRoutes.post('quiz/create', quizController.createQuiz);
quizRoutes.post('/quiz/answer/add', quizController.addAnswer);


