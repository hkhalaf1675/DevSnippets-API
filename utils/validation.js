const niv = require('node-input-validator');
const express = require('express');
const User = require('../models/user.model');

//#region custom rules
niv.extend('uniqueUser', async({value, args}) => {
    const exists = await User.findOne({ email: value });
    if(exists)
        return false;
    return true;
});
//#endregion

//#region validate function
/**
 * Validates given data against provided rules.
 * @param {Object} data - The input data to validate.
 * @param {{ [key: string]: string }} rules - The validation rules.
 * @returns {Promise<{ isMatched: boolean, errors: string[] }>} - Validation result.
 */
const validate = async(data, rules) => {
    niv.addCustomMessages({ 
        'email.required': 'Email is mandatory',
        'uniqueUser': 'There is already user exists with that email'
    }, 'en');

    const v = new niv.Validator(data, rules);

    const isMatched = await v.check();
    if(isMatched){ 
        return { isMatched, errors: [] };
    }
    const errors = Object.values(v.errors).map(e => e.message);

    return { isMatched, errors };
}
//#endregion

//#region validation function
/**
 * Express middleware generator for validating request data.
 * @param {{ [key: string]: string }} rules - Validation rules for request data.
 * @param {'body' | 'query' | 'params'} [source='body'] - The request source to validate.
 * @returns {express.RequestHandler} - Express middleware function.
 */
const validation = (rules, source = 'body') => {
    /**
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    return async (req, res, next) => {
        const data = req[source];
        const result = await validate(data, rules);
        if(result.isMatched){
            return next();
        }
        return res.status(422).json({
            success: false,
            message: 'Validation Error',
            errors: result.errors
        });
    }
};

//#endregion

module.exports = { validate, validation };