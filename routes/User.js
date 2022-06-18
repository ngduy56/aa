const express = require('express');
const route = express.Router();
const userController = require('../controller/User');

// route.get('/', userController.getUser);
route.get('/user', userController.getDetailUser);
route.put('/user', userController.updateUser);
route.post('/login', userController.loginUser);
route.post('/signup', userController.signUpUser);
route.post('/similar', userController.getSimilar);
route.get('/toprated', userController.getTopRated);

module.exports = route;