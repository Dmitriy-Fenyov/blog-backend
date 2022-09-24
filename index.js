import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {validationResult} from 'express-validator';
import bcrypt from 'bcrypt';
import cors from 'cors';

import {registerValidation} from './validations/auth.js'

import UserModel from './models/User.js'

mongoose
.connect('mongodb+srv://feniks26rus:feniks287@cluster0.nu1jurb.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => console.log('DB ok'))
.catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());
app.use(cors());
app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.login});

        if (!user) {
            console.log('1')
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        const isValidPass = await bcrypt.compare(String(req.body.password), user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'key', 
        {
            expiresIn: '30d',
        },
        );

        const {passwordHash, ...userData} = user._doc;

        res.json({...userData, token,});

    } catch (err) {
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        });
    }
})

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array());

        }

        const password = String(req.body.password);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.login,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        }, 'key', 
        {
            expiresIn: '30d',
        },
        );

        const {passwordHash, ...userData} = user._doc;

        res.json({...userData, token,});
    }   catch (error) {
        res.status(500).json({
            error,
            message: 'Не удалось зарегестрироваться',
        });
    }
});

app.listen(4444, (err) => {
    if(err) {
        return console.log(err);
    }
    console.log('Server OK');
});