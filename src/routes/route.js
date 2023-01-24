const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const postCtrl = require('../controllers/post');
const auth = require('../auth/auth');

router.post('/register', userCtrl.createUser);
router.get('/login', userCtrl.loginUser);

router.post('/post', auth.authentecation, auth.authorization, postCtrl.createPost);
router.get('/post/:Geolocation', auth.authentecation, postCtrl.getPost);
router.get('/posts/:userId', auth.authentecation, auth.authorization, postCtrl.allPosts);
router.put('/post/:postId', auth.authentecation, postCtrl.updatePost);
router.delete('/post/:postId', auth.authentecation, postCtrl.deletePost);

router.all('/*', (req, res) => res.status(400).send({ status: false, message: 'url not found' }));

module.exports = router;