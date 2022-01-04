const {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete
} = require('./users.controllers');

const {
    login,
    googleSignIn
} = require('./auth.controllers');

const {
    createCategory,
    allCategories,
    getACategory,
    updateCategory,
    deletecategory
} = require('./categories.controllers');

const {
    createProduct,
    allProducts,
    getAProduct,
    updateProduct,
    deleteProduct
} = require('./products.controllers');

const {
    search
} = require('./search.controllers');

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete,
    login,
    googleSignIn,
    createCategory,
    allCategories,
    getACategory,
    updateCategory,
    deletecategory,
    createProduct,
    allProducts,
    getAProduct,
    updateProduct,
    deleteProduct,
    search
}