const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const usersGet = async(req = request, res = response) => {
    // const { id, name = 'Not name', age } = req.query;
    const { limit = 5, from = 0 } = req.query;
    const query = { state: true };

    //In these queries each one ejecute after another.
    // const users = await User.find(query)
    //     .skip(Number(from))
    //     .limit(Number(limit));
    // const totalUsers = await User.countDocuments(query);

    //In these queries all execute to same time.
    const [totalUsers, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
        .skip(Number(from))
        .limit(Number(limit))
    ]);

    res.json({
        totalUsers,
        users
    });
}

const usersPost = async(req, res) => {

    const { name, email, role, pass } = req.body;
    const user = new User({ name, email, role, pass });

    // crypt pass 
    const salt = bcryptjs.genSaltSync();
    user.pass = bcryptjs.hashSync(pass, salt);
    //save in DB
    await user.save();

    res.json({
        user
    });
}

const usersPut = async(req, res) => {
    const { id } = req.params;
    const { _id, pass, google, email, ...rest } = req.body;

    if (pass) {
        const salt = bcryptjs.genSaltSync();
        rest.pass = bcryptjs.hashSync(pass, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest);
    // const userupdated = await User.findById(id);
    res.json({
        user
    });
}

const usersPatch = (req, res) => {
    res.json({
        msg: 'patch - Controller'
    });
}

const usersDelete = async(req, res) => {

    const { id } = req.params;

    //Delete in DB
    // const userDeleted = await User.findByIdAndDelete(id);

    //Not delete in db for referential identity and transactions
    const userDeleted = await User.findByIdAndUpdate(id, { state: false });

    res.json({
        userDeleted
    });
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete

}