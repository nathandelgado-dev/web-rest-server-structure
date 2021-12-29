const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth.controllers');
const { validateErrorsInFields } = require('../middlewares/validate-errors-fields.middleware');

const router = Router();

router.post('/login', [
    check('email', 'The email is requiered').isEmail(),
    check('pass', 'The password is required').not().isEmpty(),
    validateErrorsInFields
], login);

router.post('/google', [
    check('id_token', 'The id_token is requiered').not().isEmpty(),
    check('id_token', 'The id_token is requiered - JWT').isJWT(),
    validateErrorsInFields
], googleSignIn);

module.exports = router;