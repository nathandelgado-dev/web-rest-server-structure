const { Router } = require('express');
const { check } = require('express-validator');
const {
    validateErrorsInFields,
    validateJWT,
    isAdminRole
} = require('../middlewares');
const {
    allProducts,
    createProduct,
    deleteProduct,
    getAProduct,
    updateProduct,
} = require('../controllers');
const { existProductId, existCategoryId } = require('../helpers/databae-validators')

const router = Router();

//get all products-public
router.get('/', [],
    allProducts)

//get a product for id - public
router.get('/:id', [
    check('id', 'Not is id valid').isMongoId(),
    check('id').custom(existProductId),
    validateErrorsInFields
], getAProduct)

//create categorie - private - Any user with valid token
router.post('/', [
    validateJWT,
    check('name', 'Product name is required').not().isEmpty(),
    check('category', 'Id category not is valid').isMongoId(),
    check('category').custom(existCategoryId),
    validateErrorsInFields
], createProduct)

//Update Product with id - private - Any user with valid token
router.put('/:id', [
    validateJWT,
    check('id', 'Not is id valid').isMongoId(),
    check('id').custom(existProductId),
    check('name', 'Product name is required').not().isEmpty(),
    validateErrorsInFields
], updateProduct)

//Delete categorie - with admin user
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Not is id valid').isMongoId(),
    check('id').custom(existProductId),
    validateErrorsInFields
], deleteProduct)



module.exports = router;