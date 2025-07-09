const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authGuard } = require('../middlewares/auth.guard');

router.use(authGuard);

router.get('/',
    userController.getUsers
);

module.exports = router;