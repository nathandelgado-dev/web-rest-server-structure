const { response, request } = require('express');
const { Product, Categorie } = require('../models')

//Get categories - paginado - total - populate = muestra quien creo la categoria
const allProducts = async(req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { state: true };

    const [totalProducts, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
        .skip(Number(from))
        .limit(Number(limit))
        .populate('user', ['name', 'email'])
        .populate('category', 'name')
    ]);

    res.json({
        totalProducts,
        products
    });
}

//Get product - populate res{}
const getAProduct = async(req = request, res = response) => {
    const { id } = req.params;
    const product = await Product.findById(id)
        .populate('user', ['name', 'email'])
        .populate('category', 'name');

    res.json({
        product
    })
}

const createProduct = async(req = request, res = response) => {
    let { name, category, ...body } = req.body;
    name = name.toUpperCase();

    const productInDB = await Product.findOne({ name });

    if (productInDB) {
        return res.status(400).json({
            msg: `The product ${productInDB.name} exist`
        });
    }

    //data to save
    const data = {
        name,
        user: req.user._id,
        category,
        price: body.price,
        description: body.description
    }

    try {
        const product = new Product(data);

        product.save();

        res.status(201).json(product);

    } catch (err) {
        throw new Error(err);
    }
}

//update Product - 
const updateProduct = async(req = request, res = response) => {
    const { id } = req.params;
    const { state, user, ...body } = req.body;
    const category = body.category;
    const name = body.name.toUpperCase();

    if (category) {
        const categoryInDB = await Categorie.findById(category);
        if (categoryInDB) {
            const data = {
                name,
                category,
                price: body.price,
                description: body.description,
                avalible: body.avalible,
                user: req.user._id
            }

            try {

                const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
                    .populate('user', ['name', 'email'])
                    .populate('category', 'name');

                res.status(201).json({
                    updatedProduct
                })

            } catch (err) {
                console.error(err);
                res.status(500).json({
                    msg: 'Contact to administrator, the product not updated'
                })
                throw new Error('Contact to administrator');
            }
        } else {
            res.status(401).json({
                msg: `The category Id ${category} not exist`
            })
        }
    }

    const data = {
        name,
        price: body.price,
        description: body.description,
        avalible: body.avalible,
        user: req.user._id
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
            .populate('user', ['name', 'email'])
            .populate('category', 'name');

        res.status(201).json({
            updatedProduct
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Contact to administrator'
        })
        throw new Error('Contact to administrator');
    }
}

//Delete product- change state to false
const deleteProduct = async(req = request, res = response) => {
    const { id } = req.params;

    try {
        const deletedcategory = await Product.findByIdAndUpdate(id, { state: false, user: req.user._id }, { new: true })
            .populate('user', ['name', 'email'])
            .populate('category', 'name');

        res.status(201).json({
            deletedcategory
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msj: 'Contact to administrator, this product can not be delete'
        });
        throw new Error('Contact to administrator')
    }
}


module.exports = {
    createProduct,
    allProducts,
    getAProduct,
    updateProduct,
    deleteProduct
}