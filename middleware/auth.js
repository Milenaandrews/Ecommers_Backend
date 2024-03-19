const { expressjwt } = require('express-jwt');
require('dotenv').config();

const getToken = (req) => {
    const { authorization } = req.headers;
    console.log(authorization)

    if (authorization) {
        console.log("entro al if")
        const [type, token] = authorization.split(' ');
        return type === "Bearer" ? token : null;
    }

    return null;
}

const auth = expressjwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'],
    userProperty: 'user',
    getToken
});

module.exports = auth;
