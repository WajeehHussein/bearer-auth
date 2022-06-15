'use strict';
const express = require('express');
const usersRouter = express.Router();

const bcrypt = require('bcrypt');

const { Users } = require('../models/index')
const auth = require('../middlewares/auth')


usersRouter.get('/', home)
usersRouter.post('/signup', signUp);
usersRouter.post('/signin', auth(Users), signIn);


function home(req, res) {
    res.send('home page')
}

async function signUp(req, res) {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const record = await Users.create(req.body);
        res.status(200).json(record);

    } catch (e) { res.status(403).send('Error Creating User'); }
}

async function signIn(req, res) {
    res.status(200).json(req.user);

}

module.exports = usersRouter;