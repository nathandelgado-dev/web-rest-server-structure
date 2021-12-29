const validateErrorsInFields = require('../middlewares/validate-errors-fields.middleware');
const validateJWT = require('../middlewares/validate-jwt');
const validateRole = require('../middlewares/validate-role');

module.exports = {
    ...validateErrorsInFields,
    ...validateJWT,
    ...validateRole
}