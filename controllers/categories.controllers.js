const { response, request } = require('express');
const { Categorie } = require('../models')

//Get categories - paginado - total - populate = muestra quien creo la categoria
const allCategories = async(req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { state: true };

    const [totalCategories, categories] = await Promise.all([
        Categorie.countDocuments(query),
        Categorie.find(query)
        .skip(Number(from))
        .limit(Number(limit))
        .populate('user', ['name', 'email'])
    ]);

    res.json({
        totalCategories,
        categories
    });
}

//Get category - populate res{}
const getACategory = async(req = request, res = response) => {
    const { id } = req.params;
    const category = await Categorie.findById(id).populate('user', 'name');

    res.json({
        category
    })
}

const createCategory = async(req = request, res = response) => {
    const name = req.body.name.toUpperCase();

    const categoryInDB = await Categorie.findOne({ name });

    if (categoryInDB) {
        return res.status(400).json({
            msg: `The category ${categoryInDB.name} exist`
        });
    }

    //data to save
    const data = {
        name,
        user: req.user._id
    }

    const category = new Categorie(data);

    //save in DB
    category.save();

    res.status(201).json(category);
}

//update category - 

const updateCategory = async(req = request, res = response) => {
    const { id } = req.params;
    const name = req.body.name.toUpperCase();
    const data = {
        name,
        user: req.user._id
    }
    try {
        const updatedCategory = await Categorie.findByIdAndUpdate(id, data, { new: true }).populate('user', ['name', 'email']);

        res.status(201).json({
            updatedCategory
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Contact to administrator'
        })
        throw new Error('Contact to administrator');
    }
}

//Delete categoria- change state to false
const deletecategory = async(req = request, res = response) => {
    const { id } = req.params;

    try {
        const deletedcategory = await Categorie.findByIdAndUpdate(id, { state: false, user: req.user._id }, { new: true }).populate('user', ['name', 'email']);

        res.status(201).json({
            deletedcategory
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msj: 'Contact to administrator'
        });
        throw new Error('Contact to administrator')
    }
}


module.exports = {
    createCategory,
    allCategories,
    getACategory,
    updateCategory,
    deletecategory
}