const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { createJWT } = require('../helpers/create-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { json } = require('express/lib/response');

const login = async(req, res = response) => {
    const { email, pass } = req.body;
    try {
        //Exist email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: "The email / passsword is wrong"
            })
        }
        //Is Active user
        if (!user.state) {
            return res.status(400).json({
                msg: "The email / passsword is wrong inactive"
            })
        }
        //Verify pass
        const validPass = bcryptjs.compareSync(pass, user.pass);
        if (!validPass) {
            return res.status(400).json({
                msg: "The email / passsword is wrong inactive - pass"
            })
        }
        //Create JWT
        const token = await createJWT(user.id);

        res.json({
            user,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Contact to API administrator"
        })
    }
}

const googleSignIn = async(req = request, res = response) => {
    const { id_token } = req.body;

    try {
        const { name, email, img } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        //if not exist user he will be create
        if (!user) {
            const data = {
                name,
                email,
                pass: 'g00gl34cc3s:P',
                img,
                google: true,
                role: 'USER_ROLE'
            }

            user = new User(data);
            await user.save();
        }

        //If inactive user he will not enter 
        if (!user.state) {
            return res.status(401).json({
                msg: 'Contact the administrator - blocked user'
            });
        }

        const token = await createJWT(user.id);

        res.status(200).json({
            user,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            msg: 'Can not verify token'
        });
    }
}

module.exports = {
    login,
    googleSignIn
}