const express = require('express');
const User = require('../models/user.model');
const { verifyToken } = require('../utils/jwt');

//#region auth guard middleware
/**
 * Auth guard middleware to protect routes
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const authGuard = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header missing or malformed',
                errors: ['Authorization header missing or malformed']
            });
        }

        const token = authHeader.split(' ')[1];
        const decode = verifyToken(token);

        const user = await User.findById(decode.id).lean();

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
                errors: ['The user belonging to this token no longer exists']
            });
        }

        req['user'] = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            errors: ['Invalid or expired token']
        });
    }
}
//#endregion

module.exports = { authGuard };