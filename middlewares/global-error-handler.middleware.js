const express = require('express');
/**
 * Global error handler middleware for Express
 * @param {Error} err
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    res.status(500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV == 'development' && err.stack)
    });
}

module.exports = { errorHandler };