const { User, Categorie, Role, Product } = require('../models');

const roleValidation = async(role = '') => {
    const existRole = await Role.findOne({ role });
    if (!existRole) {
        throw new Error(`The role ${role} not exist`)
    }
}

const existEmail = async(email = '') => {
    const searchEmail = await User.findOne({ email });
    if (searchEmail) {
        throw new Error('This email was registered')
    }
}

const existUserId = async(id) => {
    const searchId = await User.findById(id);

    if (!searchId) {
        throw new Error(`The id ${id} not  exist`)
    }
}

const existCategoryId = async(id) => {
    const searchId = await Categorie.findById(id);

    if (!searchId) {
        throw new Error(`The id ${id} not  exist`)
    }
}

const existProductId = async(id) => {
    const searchId = await Product.findById(id);

    if (!searchId) {
        throw new Error(`The id ${id} not  exist`)
    }
}




module.exports = {
    roleValidation,
    existEmail,
    existUserId,
    existCategoryId,
    existProductId
}