require('dotenv').config();
const env = process.env.NODE_ENV || 'development';

const baseConfig = {
    port: +(process.env.PORT || '7000'),
    mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dev_snippets",
    allowOrigins: process.env.ALLOWED_ORIGINS || '*',
    jwt: {
        secret: process.env.JWT_SECRET || 'jwt secret key',
        expiresIn: process.env.JWT_EXPIRESIN || '1h'
    }
};

const environmentOverrides = {
    development: {},
    production: {}
};

module.exports = { ...baseConfig, ...environmentOverrides[env] };