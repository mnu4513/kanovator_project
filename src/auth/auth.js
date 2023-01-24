const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const postModel = require('../models/post');
const {isValidObjectId} = require('mongoose');

const authentecation = async function (req, res, next) {
    const token = req.headers['x-auth-token'];

    if (!token) return res.status(400).send({ status: false, message: 'please login first' });

    jwt.verify(token, 'key', (error, decoded) => {
        if (error) return res.status(400).send({ status: false, message: 'either token is invaid or has been expired' });
        req.token = decoded;
        next();
    });
};

const authorization = async function (req, res, next) {
    const userName = req.body.createdBy;
    const tokenUserId = req.token.userId;
    const userId = req.params.userId; 
    const postId = req.params.postId;

    if (userId && !isValidObjectId(userId)) return res.status(400).send({status: false, message: 'please enter a valid userId'});
    if (postId && !isValidObjectId(postId)) return res.status(400).send({status: false, message: 'please enter a valid postId'});
    if (userName) {
        const userData = await userModel.findOne({userName: userName});
        if (!userData) return res.status(400).send({status: false, message: 'no user found with given user name of createdBy'});
        if (tokenUserId != userData._id) return res.status(400).send({status: false, message: 'user is not authorized to create a post with different user name'});
        req.body.createdBy = userData._id;
        next();
    };
    if (userId) {
        const userData = await userModel.findById(userId);
        if (!userData) return res.status(400).send({status: false, message: 'userId provided is invalid'});
        if (tokenUserId != userData._id) return res.status(400).send({status: false, message: 'user is not authorized to see all active and inactive posts of different user'});
        next();
    };
    if (postId) {
        const postData = postModel.findById(postId);
        if (!postData) return res.status(400).send({status: false, message: 'no post found with given postId'});
        if (tokenUserId != postData.createdBy) return res.status(400).send({status: false, message: 'you are not authorized to perform this action on the post of a different user'});
        next();
    };
};

module.exports = { authentecation, authorization };