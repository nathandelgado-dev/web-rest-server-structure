const { request, response } = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');



const validateJWT = async(req = request, res = response, next) => {
    const token = req.header('x-api-key');
    if (!token) {
        return res.status(401).json({
            msg: 'The token is required'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                msg: 'The token is invalid - user not exist'
            })
        }

        if (!user.state) {
            return res.status(401).json({
                msg: 'The token is invalid - state false'
            })
        }

        req.user = user;

        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            msg: 'The token is invalid'
        });
    }
}


module.exports = {
    validateJWT
}