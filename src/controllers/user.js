const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const {validName, validUserName, validPassword} = require('../validators/validator');

const createUser = async function (req, res) {
    try {
        const data = req.body;

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: 'please enter user details to register' });
        const {name, userName, password} = data;
        if (name) return res.status(400).send({ status: false, message: 'name is required to register' });
        if (!validName(name.trim())) return res.status(400).send({Status: false, message: 'please enter a valid name'});
        if (userName) return res.status(400).send({ status: false, message: 'userName is required to register' });
        if (!validUserName(userName.trim())) return res.status(500).send({status: false, message: 'please enter a valid user name'});
        if (password) return res.status(400).send({ status: false, message: 'password is required to register' });
        if (!validPassword.validate(password.trim())) return res.status(400).send({status: false, message: 'please choose a strong password'});
        
        const user = await userModel.findOne({userName: data.userName});
        if (user) return res.status(400).send({status: false, message: 'userName already used, please enter a unique user name'});
        
        const userCreated = await userModel.create(data);
        res.status(201).send({ status: true, data: { name, userName }, message: 'user registration sucessful' });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};


const loginUser = async function (req, res) {
    try {
        const data = req.body;
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: 'please enter user details to login' });
        const {userName, password} = data;
        if (userName) return res.status(400).send({ status: false, message: 'user name is required to login' });
        if (!validUserName(userName.trim())) return res.status(400).send({status: false, message: 'please enter a valid user name to login'});
        if (password) return res.status(400).send({ status: false, message: 'password is required to login' });

        const userLoggedIn = await userModel.findOne({ userName: data.userName, password: data.password });
        if (!userLoggedIn) return res.status(400).send({ status: false, message: 'userName or password is incorrect' });

        const { _id} = userLoggedIn;
        const token = jwt.sign({userId: _id }, 'key');

        res.setHeader('x-auth-token', token);
        res.status(200).send({ status: true, data: { token: token }, message: 'login sucessfull' });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

module.exports = { createUser, loginUser };