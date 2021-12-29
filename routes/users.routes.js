const { Router } = require('express');
const { check } = require('express-validator');

const {
    validateErrorsInFields,
    validateJWT,
    isAdminRole,
    authorizedRole
} = require('../middlewares');

const {
    roleValidation,
    existEmail,
    existUserId
} = require('../helpers/databae-validators');
const {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete
} = require('../controllers/users.controllers');
const router = Router();

router.get('/', usersGet);

router.put('/:id', [
    check('id', 'Is not valid ID').isMongoId(),
    check('id').custom(existUserId),
    check('role').custom(roleValidation),
    validateErrorsInFields
], usersPut);

router.post('/', [
    check('name', 'The value of name not can to be empty').not().isEmpty(),
    check('pass', 'The value of pass is minimum 6 characters').isLength({ min: 6 }),
    check('email', 'The value of email is invalid').isEmail(),
    check('email').custom(existEmail),
    // check('role', 'Is not permited role').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(roleValidation),
    validateErrorsInFields
], usersPost);

router.patch('/', usersPatch);

router.delete('/:id', [
    validateJWT,
    //isAdminRole, only if id ADMIN_ROLE
    authorizedRole('ADMIN_ROLE', 'SALE_ROLE'),
    check('id', 'Is not valid ID').isMongoId(),
    check('id').custom(existUserId),
    validateErrorsInFields
], usersDelete);

module.exports = router;