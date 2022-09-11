import { body } from 'express-validator'

export const registerValidation = [
    body('login', 'Небходимо ввести логин'),
    body('password', 'Пароль должен быть минимум 6 символов').isLength({min: 6}),
];