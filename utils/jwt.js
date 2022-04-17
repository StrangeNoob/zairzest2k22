const jwt = require('jsonwebtoken');
const config = require('../config');

const createJWT = (user) => {
    return jwt.sign({
        id: user._id,
        date: Date.now(),
    }, config.jwtSecret);
}

const verifyJWT = (token) => {
    try{
        let decode = jwt.verify(token, config.jwtSecret);
        return {
            status: true,
            data: decode,
            error: {},
        };
    } catch (err) {
        return {
            status: false,
            data: {},
            error:  err.message
        };
    }
}

module.exports = {
    createJWT,
    verifyJWT,
}