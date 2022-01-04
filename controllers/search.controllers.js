const { request, response } = require('express');
const { isValidObjectId } = require('mongoose');
const { User, Categorie, Product } = require('../models');


const avalibleCollections = [
    'categories',
    'products',
    'users',
    'roles'
];

const searchCategories = async(term, res = response) => {
    const istermMongoId = isValidObjectId(term);

    if (istermMongoId) {
        const category = await Categorie.findById(term)
            .populate('user', ['name', 'email']);

        return res.status(200).json({
            result: (category) ? [category] : []
        })
    }

    const regex = new RegExp(term, 'i');
    const query = {
        name: regex,
        state: true
    }

    const [totalCategories, categories] = await Promise.all([
        Categorie.count(query),
        Categorie.find(query)
        .populate('user', ['name', 'email'])
    ]);

    res.status(200).json({
        result: [totalCategories, categories]
    });
}

const searchProducts = async(term, res = response) => {
    const istermMongoId = isValidObjectId(term);

    if (istermMongoId) {
        const product = await Product.findById(term)
            .populate('user', ['name', 'email']);

        return res.status(200).json({
            result: (product) ? [product] : []
        })
    }

    const regex = new RegExp(term, 'i');
    const query = {
        name: regex,
        state: true
    }

    const [totalProducts, products] = await Promise.all([
        Product.count(query),
        Product.find(query).populate('user', ['name', 'email'])
    ]);

    res.status(200).json({
        result: [totalProducts, products]
    });
}

const searchUser = async(term, res = response) => {
    const istermMongoId = isValidObjectId(term);

    if (istermMongoId) {
        const user = await User.findById(term);
        return res.status(200).json({
            result: (user) ? [user] : []
        })
    }

    const regex = new RegExp(term, 'i');
    const query = {
        $or: [{ name: regex }, { email: regex }],
        $and: [{ state: true }]
    }

    const [totalUsers, users] = await Promise.all([
        User.count(query),
        User.find(query)
    ]);

    res.status(200).json({
        result: [totalUsers, users]
    });
}


const search = (req = request, res = response) => {
    let { collection, term } = req.params;
    collection = collection.toLowerCase();

    if (!avalibleCollections.includes(collection)) {
        return res.status(400).json({
            msg: `The avalibles collections are ${avalibleCollections}`
        })
    }

    switch (collection) {
        case 'categories':
            searchCategories(term, res);
            break
        case 'products':
            searchProducts(term, res);
            break
        case 'users':
            searchUser(term, res);
            break
        default:
            res.status(500).json({
                msg: 'Search not implemented'
            })
    }


}

module.exports = {
    search
}