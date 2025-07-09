const niv = require('node-input-validator');
const express = require('express');

//#region custom rules
niv.extend('rule', async({value, args}) => {
    // logic of the rule
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
        'email.required': 'Email is mandatory'
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
const validation = async(rules, source = 'body') => {
    /**
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    return async(req, res, next) => {
        const data = req[source];

        const result = await validate(data, rules);
        if(result.isMatched){
            return next();
        }
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: result.errors
        });
    }
}
//#endregion

module.exports = { validate, validation };