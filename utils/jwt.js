const jwt = require('jsonwebtoken');
const config = require('../config/config');

const jwtSecret = config.jwt.secret;

//#region sign token 
/**
 * Sign a JWT token.
 * @param {object} payload
 * @returns {string} Signed JWT token
 */
const signToken = (payload) => {
    return jwt.sign(payload, jwtSecret, {
        expiresIn: config.jwt.expiresIn
    });
}
//#endregion

//#region verify token
/**
 * Verify a JWT token.
 * @param {string} token
 * @returns {object|null} Decoded payload or null if invalid
 */
const verifyToken = (token) => {
    return jwt.verify(token, jwtSecret);
}
//#endregion

module.exports = { signToken, verifyToken };