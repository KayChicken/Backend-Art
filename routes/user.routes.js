import {Router} from 'express'
export const userRouter = new Router()
import {userController} from '../controller/user.controller.js'
import {registerValidator} from '../validations/auth.js'
import { authController } from '../controller/auth.controller.js'
import checkAuth from '../utils/checkAuth.js'


userRouter.get('/auth/me',checkAuth, authController.authMe) 
userRouter.post('/auth/login' , userController.loginUser)
userRouter.post('/auth/registration' ,registerValidator ,userController.createUser)
userRouter.get('/users' , userController.getUsers)
userRouter.get('/user/:id' , userController.getOneUser)
userRouter.get('/activate/:link', userController.activate)
userRouter.get('/rate/users', userController.getUsersRating)
userRouter.post('/auth/logout' , userController.logout)
userRouter.post('/auth/refresh' , userController.refresh)



