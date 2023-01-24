const { isValidObjectId } = require('mongoose');
const postModel = require('../models/post');
const userModel = require('../models/user');
const { validtitle, validLocation, validUserName } = require('../validators/validator');

const createPost = async function (req, res) {
    try {
        const data = req.body;
        console.log(data);
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: 'please enter post details to create a post' });
        const { title, body, createdBy, status, Geolocation, userName } = data;
        if (!title) return res.status(400).send({ status: false, message: 'title is required to create a post' });
        if (!validtitle(title)) return res.status(400).send({ status: false, message: 'please enter a valid title' });
        if (!body) return res.status(400).send({ status: false, message: 'body is required to create a post' });
        if (body.trim().length > 5) return res.status(400).send({ status: false, message: 'please enter a valid post body' });
        if (!createdBy) return res.status(400).send({ status: false, message: 'user name is required to create a post' });
        if (!validUserName(createdBy)) return res.status(400).send({ status: false, message: 'please enter a valid user name' });
        if (status && !['active', 'inactive', undefined].includes(status)) return res.status(400).send({ status: false, message: 'please enter a valid status' });
        if (!Geolocation) return res.status(400).send({ status: false, message: 'please enter provide geoLocation' });
        if (!validLocation(Geolocation)) return res.status(400).send({ status: false, message: 'please enater a valid location' });

        const postCreated = await postModel.create(data);
        res.status(201).send({ status: true, data: { title, body, createdBy, status, Geolocation }, data: postCreated });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

const getPost = async function (req, res) {
    try {
        const Geolocation = req.params.Geolocation;

        const post = await postModel.findOne({ Geolocation: Geolocation, status: 'active', isDeleted: false });
        if (!post) return res.status(400).send({ status: false, message: 'no post found with given Geolocation' });

        const { _id, title, body, createdBy } = post;

        res.status(200).send({ status: true, data: { _id, title, body, createdBy, Geolocation } })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

const allPosts = async function (req, res) {
    try {
        const userId = req.params.userId;

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: 'please enter a valid userId' });

        const user = await userModel.findById(userId);
        if (!user) return res.status(400).send({ status: false, message: 'no user found with given userId' });
        const posts = await postModel.find({ createdBy: userId }).select({ title: 1, body: 1, Geolocation: 1, status: 1 });

        if (posts.length == 0) return res.status(200).send({ status: true, message: 'this user has not any post or all posts have already been deleted' });
        let activePosts = 0;
        let inactivePosts = 0;
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].status == 'active') {
                activePosts += 1;
            };
            if (posts[i].status == 'inactive') {
                inactivePosts += 1;
            };
        };

        res.status(200).send({ status: true, data: { user: user.name, userEmail: user.email, userId: userId, activePosts: activePosts, inactivePosts: inactivePosts, allPosts: posts } });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

const updatePost = async function (req, res) {
    try {
        const postId = req.params.postId;
        const data = req.body;

        if (!isValidObjectId(postId)) return res.status(400).send({ status: false, message: 'please enter a valid postId' });

        const post = await postModel.findOneAndUpdate({ _id: postId, isDeleted: false }, data, { new: true }).select({ title: 1, body: 1, createdBy: 1, Geolocation: 1 });

        if (!post) return res.status(400).send({ status: false, message: 'no post find by given postId or post has already been deleted' });

        res.status(200).send({ status: true, data: post });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

const deletePost = async function (req, res) {
    try {
        const postId = req.params.postId;

        if (!isValidObjectId(postId)) return res.status(400).send({ status: false, message: 'please enter a valid postId' });

        const postDeleted = await postModel.findOneAndUpdate({ _id: postId, isDeleted: false }, { isDeleted: true }, { new: true });
        if (!postDeleted) return res.status(400).send({ status: false, message: 'either post does not exits with given postId or already deleted' });

        res.status(200).send({ status: true, message: 'post deleted' });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

module.exports = { createPost, getPost, allPosts, updatePost, deletePost };