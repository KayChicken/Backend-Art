import { db } from '../db.js'

class AuthController {
    async authMe(req,res) {
        try {
            const user = await db.query("SELECT * FROM users WHERE user_id = $1" , [req.userId])
            if (!user) {
                res.status(400).json({"message" : "Пользователь не найден"})
            }
            res.json({...user.rows[0]})
        }


        catch(err) {
            return res.status(400).json({"message" : "Произошла ошибка"})
        }
    }

}


export const authController = new AuthController