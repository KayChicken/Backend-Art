import { validationResult } from 'express-validator'
import { db } from '../db.js'
import  jwt  from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import { mailService } from '../service/mail-service.js';
import { tokenService } from '../service/token-service.js';



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
            const image = img ? img : "https://demo-backend-s05i.onrender.com/uploads/default_photo.png"
            const activationLink = uuidv4()

            const newPerson = await db.query('INSERT INTO users (user_name,user_surname,user_lastname,user_login,user_hashPassword,user_age,user_email,user_phone,user_photo,user_education,activationLink) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',[name,surname,lastname,login,hashPassword,age,email,phone,image,education,activationLink])
            const {user_id , isactivated} = newPerson.rows[0]
            await mailService.sendActivationMail(email,`${process.env.API_URL}/activate/${activationLink}`)
            const tokens = tokenService.generateToken({
                id : user_id,
                email,
                isactivated
            })
            tokenService.saveToken(user_id, tokens.refreshToken)
            res.json({...newPerson.rows, ...tokens})
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


    async setActivateAccount (activationLink) {
        const user = await db.query("SELECT * FROM users WHERE activationlink = $1", [activationLink])
        const {user_id} = user.rows[0]
        if (!user) {
            throw new Error('Некорректная ссылка аткивации')
        }
        await db.query("UPDATE users SET isactivated = TRUE WHERE user_id = $1" , [user_id])
    }




    async activate(req,res) {
       try {
            const activationLink = req.params.link
            await userController.setActivateAccount(activationLink)
            return res.status(200).json({"message" : "Почта успешно была подтверждена"})
       }
       catch (err) {
        res.status(400).json({"message" : "Произошла ошибка"})
       }
    }

    





}

export const userController = new UserController

