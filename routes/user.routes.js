import {Router} from 'express'
export const userRouter = new Router()
import {userController} from '../controller/user.controller.js'
import {registerValidator} from '../validations/auth.js'
import { authController } from '../controller/auth.controller.js'
import checkAuth from '../utils/checkAuth.js'


userRouter.get('/auth/me',checkAuth, authController.authMe) 
userRouter.post('/auth/login' , userController.loginUser)
userRouter.post('/auth/registration' ,registerValidator ,userController.createUser)
userRouter.get('/user' , userController.getUsers)
userRouter.get('/user/:id' , userController.getOneUser)
userRouter.put('/user' , userController.updateUser)
userRouter.delete('/user/:id' , userController.deleteUser)




