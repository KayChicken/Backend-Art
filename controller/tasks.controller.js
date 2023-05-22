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
            const isAnswee = await db.query("SELECT * FROM tasks_quiz_answers WHERE quiz_id = $1 AND fk_user_id = $2",[quiz_id,id])
            if (isAnswee.rowCount <= 0) {
                const userRating = await db.query("UPDATE users SET user_rating = user_rating + 1 WHERE user_id = $1",[req.userId])
                const sendAnswer = await db.query("INSERT INTO tasks_quiz_answers VALUES ($1,$2,$3)",[quiz_id,id,user_answer])
                return res.status(200)
            }
            return res.status(200)
            
            
        }

        catch(err) {
            return res.status(400).json({"message" : "Произошла ошибка"})
        }
    }

}



export const tasksController = new TasksController