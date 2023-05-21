import { db } from '../db.js'
class TasksController {
    

    async getQuizes(req,res) {
        try {
            const tasks = await db.query("SELECT * FROM tasks_quiz")
            res.status(200).json({...tasks.rows})
        }

        catch(err) {
            return res.status(400).json({"message" : "Произошла ошибка"})
        }
    }



    async getOneQuiz(req,res) {
        try{
            const id = req.params.id
            const tasks = await db.query("SELECT * FROM tasks_quiz WHERE task_id = $1" , [id])
            res.status(200).json({...tasks.rows})

        }


        catch(err) {
            return res.status(400).json({"message" : "Произошла ошибка"})
        }
    }

}



export const tasksController = new TasksController