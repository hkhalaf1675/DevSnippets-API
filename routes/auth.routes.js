const express = require('express');
const { validation } = require('../utils/validation');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/register',
    validation({
        name: 'required|string',
        email: 'required|email|uniqueUser',
        password: 'required|string'
    }, 'body'),
    userController.register
);

router.post('/login',
    validation({
        email: 'required|email',
        password: 'required|string'
    }, 'body'),
    userController.login
);

module.exports = router;