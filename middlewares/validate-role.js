const { request, response } = require('express');

const isAdminRole = (req = request, res = response, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'First validate token before of role'
        });
    }

    const { role, name } = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} not is authorized`
        });
    }

    next();
}

const authorizedRole = (...roles) => {
    return (req = request, res = response, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: 'First validate token before of role'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: 'The role not is authorized'
            });
        }

        next()
    }
}

module.exports = {
    isAdminRole,
    authorizedRole
}