import { db } from '../db.js'
class TasksController {
    

    async getQuizes(req,res) {
        try {
            const tasks = await db.query("SELECT * FROM tasks_quiz")
            res.status(200).json(tasks.rows)
        }

        catch(err) {
            return res.status(400).json({"message" : "Произошла ошибка"})
        }
    }



    async getOneQuiz(req,res) {
        try{
            const id = req.params.id
            const tasks = await db.query("SELECT * FROM tasks_quiz WHERE task_id = $1" , [id])
            res.status(200).json(tasks.rows)

        }


        catch(err) {
            return res.status(400).json({"message" : "Произошла ошибка"})
        }
    }


    async answerByUser(req,res) {
        try {
            const {quiz_id, user_answer} = req.body
            const id = req.userId
            const sendAnswer = await db.query("INSERT INTO tasks_quiz_answers VALUES ($1,$2,$3)",[quiz_id,id,user_answer])
            res.status(200).json(sendAnswer.rows)
        }

        catch(err) {
            return res.status(400).json({"message" : "Произошла ошибка"})
        }
    }

}



export const tasksController = new TasksController