const express = require('express');
const User = require('../models/user.model');
const { signToken } = require('../utils/jwt');

//#region register new user
/**
 * Registers a new user and returns a JWT token.
 * @param {express.Request} req - The Express request object containing user input in `req.body`.
 * @param {express.Response} res - The Express response object used to return status and data.
 * @returns {void}
 */
const register = async(req, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password
    });

    const token = signToken({id: user.id, name });

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
        success: true,
        message: 'You have been registered successfully',
        data: {
            user: userObj,
            token
        }
    });
}
//#endregion

//#region user login
/**
 * Login user and returns a JWT token.
 * @param {express.Request} req - The Express request object containing email and password in `req.body`.
 * @param {express.Response} res - The Express response object used to return status and data.
 * @returns {void}
 */
const login = async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    
    if(!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
            success: false,
            message: 'Validation Error',
            errors: ['There was a problem logging in. Check your email and password or create an account.']
        });
    }

    const token = signToken({id: user.id, name: user.name });

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
        success: true,
        message: 'You have been logined successfully',
        data: {
            user: userObj,
            token
        }
    });
}  
//#endregion

//#region get all users
/**
 * Fetches a paginated list of users, optionally filtered by name.
 * @param {express.Request} req - Express request object. Accepts `name`, `page`, and `perPage` as query parameters.
 * @param {express.Response} res - Express response object used to send user data.
 * @returns {void}
 */

const getUsers = async(req, res) => {
    let { name, page, perPage } = req.query;

    page = page ? +page : 1;
    perPage = perPage ? +perPage : 10;

    let filter = {};
    if(name){
        filter.name = { $regex: new RegExp(name, 'i') };
    }

    const [users, total] = await Promise.all([
        User.find(filter)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec(),
        User.countDocuments(filter)
    ]);

    res.status(200).json({
        success: true,
        message: '',
        data: {
            pageInfo: {
                totalItems: total,
                totalPages: Math.ceil(total/perPage),
                currentPage: page
            },
            users
        }
    });
}
//#endregion

module.exports = { register, login, getUsers };