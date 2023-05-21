import { validationResult } from 'express-validator'
import { db } from '../db.js'
import  jwt  from 'jsonwebtoken'
import bcrypt from 'bcrypt'

class UserController {

    async loginUser (req,res) {

        try {
            const {login,password} = req.body
            const findUser = await db.query("SELECT * FROM users WHERE user_login = $1",[login])
            if (findUser.rowCount <= 0) {
                return res.status(400).json({"message" : "Неверный логин или пароль"})
            }

            const user = findUser.rows[0]
            const isValidPass = await bcrypt.compare(password,user['user_hashpassword'])
            if (!isValidPass) {
                return res.status(400).json({"message" : "Неверный логин или пароль"})
            }

            const token = jwt.sign({
                id : user['user_id'],

            }, 'SECRET_KEY', {expiresIn: '30d'})
            
            const {user_hashpassword , ...userData} = user
            res.json({...userData , token})
        }

        

        catch(err) {
            console.log(err)
            return res.status(500).json({"message" : "Произошла ошибка"})
        }
    }





    async createUser(req,res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            } 
               
            const {name,surname,lastname,login,password,age,email,phone,img,education} = req.body

            if ((await db.query("SELECT * FROM users WHERE user_login = ($1)", [login])).rowCount > 0) {
                return res.status(400).json({message : "Пользователь с таким логином уже существует"})
            }
            

            if ((await db.query("SELECT * FROM users WHERE user_email = ($1)", [email])).rowCount > 0) {
                return res.status(400).json({message : "Пользователь с такой почтой уже существует"})
            }

            
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password,salt)
            const image = img ? img : "https://localhost:8080/static/defaultPhoto"
            const newPerson = await db.query('INSERT INTO users (user_name,user_surname,user_lastname,user_login,user_hashPassword,user_age,user_email,user_phone,user_photo,user_education) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',[name,surname,lastname,login,hashPassword,age,email,phone,image,education])
            const token = jwt.sign({
                id : newPerson.rows[0]['user_id'],

            }, 'SECRET_KEY', {expiresIn: '30d'})
      
            res.json({...newPerson.rows,token})
        }


        catch (err) {
            console.log(err)
            res.status(500).json({
                "message" : 'Не удалось зарегистрироваться'
            })
        }
    }

    async getUsers(req,res) {
        const users = await db.query('SELECT * FROM users')
        res.json(users)
    }

    async getOneUser(req,res) {
        const id = req.params.id
        const oneUser = await db.query('SELECT * FROM users WHERE user_id = $1',[id])
        // console.log(oneUser.rows[0]['user_id'])
        res.json(oneUser)
    }


    async updateUser(req,res) {
        const {id,name,surname,lastname,login,password,age,email,phone,photo,education} = await req.body
        const user = await (await db.query('SELECT user_fio FROM users WHERE user_id = $1', [id]))
        const user_fio = user.rows[0]['user_fio'].split(' ')
        console.log(user_fio)
        // const updateUser = await db.query('UPDATE users SET user_surname = $1 WHERE user_id = $2',[surname,id])
        // res.json(updateUser)
    }

    async deleteUser(req,res) {

    }




}

export const userController = new UserController

