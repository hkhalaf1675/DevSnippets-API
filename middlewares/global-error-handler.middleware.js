const express = require('express');
/**
 * Global error handler middleware for Express
 * @param {Error} err
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const errorHandler = (err, req, res, next) => {
    const isDev = process.env.NODE_ENV === 'development';
    console.error(err.stack);
    
    res.status(500).json({
        success: false,
        message: isDev ? err.message : 'Something went wrong',
        ...(isDev ? { stack: err.stack } : {})
    });
}

module.exports = { errorHandler };