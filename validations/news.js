import { body } from 'express-validator'
export const newsValidator = [
    body('user_id','Неверный id').isNumeric(),
    body('news_title').isLength({min: 5}).withMessage("Название новости должно содержать больше 5 строк"),
    body('news_desc', 'Описание должно содержать больше 5 строк').isLength({min: 5}),
    body('news_img','Некорректный URL фотографии').isURL(),
]

