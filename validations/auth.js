import { body } from 'express-validator'
export const registerValidator = [
    body('email','Неверный формат почты').isEmail(),
    body('password','Пароль должен быть минимум 5 символов').isLength({min: 5}),
    body('login', 'Логин должен быть как минимум 5 символов').isLength({min: 5}),
    body('name', 'Имя должно быть минимум 2 символа').isLength({min:2, max:64}),
    body('surname','Фамилия должна быть минимум 2 символа').isLength({min:2, max:64}),
    body('lastname', 'Отчество должно быть минимум два символа').isLength({min:2, max:64}),
    body('img','Некорректный URL фотографии').optional().isURL(),


]

