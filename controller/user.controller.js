import { validationResult } from 'express-validator'
import { db } from '../db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import { mailService } from '../service/mail-service.js';
import { tokenService } from '../service/token-service.js';



class UserController {

    async loginUser(req, res) {

        try {
            const { login, password } = req.body
            const findUser = await db.query("SELECT * FROM users WHERE user_login = $1", [login])
            if (findUser.rowCount <= 0) {
                return res.status(400).json({ "message": "Неверный логин или пароль" })
            }

            const user = findUser.rows[0]
            const isValidPass = await bcrypt.compare(password, user['user_hashpassword'])
            if (!isValidPass) {
                return res.status(400).json({ "message": "Неверный логин или пароль" })
            }


            const tokens = tokenService.generateToken({
                id: user['user_id'],
                email: user['user_email'],
                isactivated: user['isactivated']
            })
            
            const { user_hashpassword, ...userData } = user
            await tokenService.saveToken(user['user_id'], tokens.refreshToken)
            res.json({ ...userData, ...tokens })
        }



        catch (err) {
            console.log(err)
            return res.status(500).json({ "message": "Произошла ошибка" })
        }
    }





    async createUser(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            }

            const { name, surname, lastname, login, password, age, email, phone, img, education } = req.body

            if ((await db.query("SELECT * FROM users WHERE user_login = ($1)", [login])).rowCount > 0) {
                return res.status(400).json({ message: "Пользователь с таким логином уже существует" })
            }


            if ((await db.query("SELECT * FROM users WHERE user_email = ($1)", [email])).rowCount > 0) {
                return res.status(400).json({ message: "Пользователь с такой почтой уже существует" })
            }


            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt)
            const image = img ? img : "https://demo-backend-s05i.onrender.com/uploads/default_photo.png"
            const activationLink = uuidv4()

            const newPerson = await db.query('INSERT INTO users (user_name,user_surname,user_lastname,user_login,user_hashPassword,user_age,user_email,user_phone,user_photo,user_education,activationLink) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *', [name, surname, lastname, login, hashPassword, age, email, phone, image, education, activationLink])
            const { user_id, isactivated } = newPerson.rows[0]
            await mailService.sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`)
            const tokens = tokenService.generateToken({
                id: user_id,
                email,
                isactivated
            })
            await tokenService.saveToken(user_id, tokens.refreshToken)
            res.json({ ...newPerson.rows, ...tokens })
        }


        catch (err) {
            console.log(err)
            res.status(500).json({
                "message": 'Не удалось зарегистрироваться'
            })
        }
    }

    async getUsers(req, res) {
        try {
            const users = await db.query('SELECT * FROM users')
            return res.json(users.rows)
        }
        catch (e) {
            res.status(400).json({ "message": "Произошла ошибка" })
        }
    }


    async getUsersRating(req, res) {
        try {
            const users = (await db.query('SELECT * FROM users WHERE user_role = 3 ORDER BY user_rating DESC LIMIT 100')).rows
            const newData = users.map((data) => {
                return {
                    user_id : data.user_id,
                    user_name : data.user_name,
                    user_rating : data.user_rating

                }
            })
            return res.json(newData)
        }
        catch (e) {
            res.status(400).json({ "message": "Произошла ошибка" })
        }

    }



    async getOneUser(req, res) {
        try {
            const id = req.params.id
            const oneUser = await db.query('SELECT * FROM users WHERE user_id = $1', [id])
            return res.json(oneUser)
        }

        catch (e) {
            res.status(400).json({ "message": "Произошла ошибка" })
        }

    }


    async setActivateAccount(activationLink) {
        try {
            const user = await db.query("SELECT * FROM users WHERE activationlink = $1", [activationLink])
            const { user_id } = user.rows[0]
            if (!user) {
                throw new Error('Некорректная ссылка аткивации')
            }
            await db.query("UPDATE users SET isactivated = TRUE WHERE user_id = $1", [user_id])
        }

        catch(e) {
            res.status(400).json({ "message": "Произошла ошибка" })
        }
        
    }




    async activate(req, res) {
        try {
            const activationLink = req.params.link
            await userController.setActivateAccount(activationLink)
            return res.status(200).json({ "message": "Почта успешно была подтверждена" })
        }
        catch (err) {
            res.status(400).json({ "message": "Произошла ошибка" })
        }
    }


    async logout(req, res) {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) {
                return res.status(400).json({ "message": "Произошла ошибка" })
            }
            // Удалить куки из приложения
            const token = await tokenService.removeToken(refreshToken)
            return res.status(200).json({ "message": "logout" })
        }

        catch (err) {
            res.status(400).json({ "message": "Произошла ошибка" })
        }
    }


    async refresh(req, res) {
        try {
            const { refreshToken } = req.body // Достаём рефреш куку
            if (!refreshToken) {
                return res.status(400).json({ "message": "Произошла ошибка" })

            }

            const userData = await tokenService.validateRefreshToken(refreshToken)
            const tokenFromDB = await tokenService.findToken(refreshToken)
            if (!userData || tokenFromDB.length === 0) {

                return res.status(400).json({ "message": "Произошла ошибка" })
            }


            const user = (await db.query("SELECT * FROM users WHERE user_id = $1", [userData.id])).rows[0]
            const tokens = tokenService.generateToken({
                id: user['user_id'],
                email: user['user_email'],
                isactivated: user['isactivated']
            })
            console.log(user['user_id'])
            await tokenService.saveToken(user['user_id'], tokens.refreshToken)

            return res.status(200).json({ ...userData, ...tokens })




        }

        catch (err) {
            res.status(400).json({ "message": "Произошла ошибка" })
        }
    }


    async getAchievementsUser (req,res) {
        try {
            
            const id = req.userId
            const achievements = await db.query("SELECT achievement_id,achievement_title,achievement_desc,achievement_img FROM achievements INNER JOIN (SELECT unnest(user_achivements) FROM users WHERE user_id = $1) as u_achievements ON u_achievements.unnest = achievements.achievement_id",[id])
            return res.status(200).json(achievements.rows)
            
        }

        catch(err) {
           
            res.status(400).json({ "message": "Произошла ошибка" })
        }
    }





}

export const userController = new UserController

