import {Router} from 'express'
export const uploadRouter = new Router()
import { tasksController } from '../controller/tasks.controller.js'
import multer from 'multer'



const storage = multer.diskStorage({
    destination : (_,__,cb) => {
        cb(null, 'uploads/img')
    },
    filename : (_,file,cb) => {
        cb(null,file.originalname);
    }
});

export const upload = multer({storage})



uploadRouter.post('/upload' , upload.single('image'), (req,res) => {
    try {
        res.json({
            url : `http://46.243.227.254:8080/uploads/img/${req.file.originalname}`
        })
    }

    catch(err) {
        return res.status(400).json({"message" : "Произошла ошибка"})
    }
    
})
