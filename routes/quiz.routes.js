import {Router} from 'express'
export const quizRoutes = new Router()
import {QuizController} from "../controller/quiz.controller.js";

quizRoutes.post('quiz/create', QuizController.createQuiz);
quizRoutes.post('/quiz/answer/add', QuizController.addAnswer);


