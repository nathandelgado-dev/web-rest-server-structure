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
    deletecategory
}