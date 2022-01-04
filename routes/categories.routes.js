const { Router } = require('express');
const { check } = require('express-validator');
const {
    validateErrorsInFields,
    validateJWT,
    isAdminRole
} = require('../middlewares');
const {
    createCategory,
    allCategories,
    getACategory,
    updateCategory,
    deletecategory
} = require('../controllers');
const { existCategoryId } = require('../helpers/databae-validators')

const router = Router();

//get all categories-public
router.get('/', [],
    allCategories)

//get a categorie for id - public
router.get('/:id', [
    check('id', 'Not is id valid').isMongoId(),
    check('id').custom(existCategoryId),
    validateErrorsInFields
], getACategory)

//create categorie - private - Any user with valid token
router.post('/', [
    validateJWT,
    check('name', 'Category name is required').not().isEmpty(),
    validateErrorsInFields
], createCategory)

//Update categorie with id - private - Any user with valid token
router.put('/:id', [
    validateJWT,
    check('id', 'Not is id valid').isMongoId(),
    check('id').custom(existCategoryId),
    check('name', 'Category name is required').not().isEmpty(),
    validateErrorsInFields
], updateCategory)

//Delete categorie - with admin user
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Not is id valid').isMongoId(),
    check('id').custom(existCategoryId),
    validateErrorsInFields
], deletecategory)



module.exports = router;