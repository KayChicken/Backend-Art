import {db} from '../db.js'

class TasksController {


  async getQuizes(req, res) {
    try {
      const tasks = await db.query("SELECT * FROM tasks_quiz")
      res.status(200).json(tasks.rows)
    } catch (err) {
      return res.status(400).json({"message": "Произошла ошибка"})
    }
  }


  async getOneQuiz(req, res) {
    try {
      const id = req.params.id
      const tasks = await db.query("SELECT * FROM tasks_quiz WHERE task_id = $1", [id])
      res.status(200).json(tasks.rows)

    } catch (err) {
      return res.status(400).json({"message": "Произошла ошибка"})
    }
  }


  async answerByUser(req, res) {
    try {
      const {quiz_id, user_answer} = req.body
      const id = req.userId
      const isAnswee = await db.query("SELECT * FROM tasks_quiz_answers WHERE quiz_id = $1 AND fk_user_id = $2", [quiz_id, id])
      if (isAnswee.rowCount <= 0) {
        const userRating = await db.query("UPDATE users SET user_rating = user_rating + 1 WHERE user_id = $1", [req.userId])
        const sendAnswer = await db.query("INSERT INTO tasks_quiz_answers VALUES ($1,$2,$3)", [quiz_id, id, user_answer])
        return res.status(200).json({"answer": sendAnswer.rows, "new_ans": true})
      }
      return res.status(200).json({"answer": isAnswee.rows, "new_ans": false})


    } catch (err) {
      return res.status(400).json({"message": "Произошла ошибка"})
    }
  }

  async answerByVideo(req, res) {
    try {

      const {task_video_id, user_answer} = req.body
      const id = req.userId
      const isAnswee = await db.query("SELECT * FROM tasks_video_answers  WHERE task_video_id = $1 AND fk_user_id = $2", [task_video_id, id])
      if (isAnswee.rowCount <= 0) {
        const userRating = await db.query("UPDATE users SET user_rating = user_rating + 2 WHERE user_id = $1", [id])
        const sendAnswer = await db.query("INSERT INTO tasks_video_answers VALUES ($1,$2,$3)", [task_video_id, id, user_answer])
        return res.status(200).json({"answer": sendAnswer.rows, "new_ans": true})
      }
      return res.status(200).json({"answer": isAnswee.rows, "new_ans": false})
    } catch (err) {
      return res.status(400).json({"message": "Произошла ошибка"})
    }
  }

  async getVideoGame(req, res) {
    try {
      const content = await db.query("SELECT * FROM tasks_video")
      res.status(200).json(content.rows)
    } catch (err) {
      return res.status(400).json({"message": "Произошла ошибка"})
    }
  }


  async addAchievement(req, res) {
    try {
      const {achievement_id} = req.body
      if (!achievement_id) {
        return res.status(400).json({"message": "Ошибка"})
      }
      const id = req.userId
      const isAchievement = await db.query("SELECT user_id FROM users WHERE $1 = ANY(user_achivements) AND user_id = $2", [achievement_id, id])
      if (isAchievement.rowCount <= 0) {
        const achievement = await db.query("UPDATE users SET user_achivements = user_achivements || $1 WHERE user_id = $2", [[achievement_id], id])

        return res.status(200).json({"message": "Новое достижение"})
      }
      return res.status(200).json({"message": "Достижение уже получено"})


    } catch (err) {
      console.log(err)
      return res.status(400).json({"message": "Произошла ошибка"})
    }
  }

  async createTask(req, res) {
    try {
      const {task_question, task_answers, task_difficult, task_correct_answer, task_correct_desc} = req.body;
      const newTask = await db.query(`INSERT INTO tasks_quiz_teachers (task_question, task_answers, task_difficult, task_correct_answer, task_correct_desc) VALUES ${task_question} ${task_answers} {${task_difficult}} ${task_correct_answer} ${task_correct_desc}`);
      return res.status(200).json(newTask.rows);
    } catch (err) {
      return res.status(400).json({"message": "Произошла ошибка"});
    }
  }
}


export const tasksController = new TasksController
