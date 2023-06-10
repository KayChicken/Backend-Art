import {db} from '../db.js'

class QuizController {
  async createQuiz(req, res) {
    try {
      const {quizes_auth_user} = req.body;
      const quiz = await db.query(`
        insert into quize (quizes_auth_user) VALUES (${quizes_auth_user})
      `)
      return res.status(200).json({
        "successfully": "Викторина успешно создана"
      })
    } catch (e) {
      return res.status(400).json({"message": "Something wrong"})
    }
  }

  async addAnswer(req, res) {
    try {
      console.log('1231231312')
      const {tasks_quizes_id, task_question, task_answers, task_correct_answer, task_correct_desc} = req.body;
      const task = await db.query(`
      insert into tasks_quiz_teachers (tasks_quizes_id, task_question, task_answers, task_correct_answer, task_correct_desc) VALUES (
        ${tasks_quizes_id}, ${task_question}, ARRAY ${task_answers}, ${task_correct_answer}, ${task_correct_desc}
        );
      `)
      return res.status(200).json({
        "successfully": "Вопрос успешно создан"
      })
    } catch (e) {
      return res.status(400).json({"message": "Something wrong"})
    }
  }
}

export const quizController = new QuizController
