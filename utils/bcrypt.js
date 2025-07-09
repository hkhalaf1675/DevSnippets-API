const bcrypt = require('bcrypt');

//#region hash text
/**
 * Hash a given text using bcrypt
 * @param {string} text - Text to hash
 * @param {number} saltRounds - Number of salt rounds (default: 10)
 * @returns {Promise<string>} - Hashed output
 */
const hashText = async(text, saltRounds = 10) => {
    const salt = await bcrypt.genSalt(saltRounds);

    return bcrypt.hash(text, salt);
}
//#endregion

//#region verify hashed text
/**
 * Compare a plain text with its hashed version
 * @param {string} text - Plain text input
 * @param {string} hashedText - Hashed value to compare against
 * @returns {Promise<boolean>} - True if matched, otherwise false
 */
const verifyHashed = async(text, hashedText) => {
    return bcrypt.compare(text, hashedText);
}
//#endregion

module.exports = { hashText, verifyHashed };