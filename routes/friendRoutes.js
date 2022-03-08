const express = require('express');
const userController = require('../controllers/userController/userController');
const friendsController = require('../controllers/friendsController/friendsController');
const adminController = require('../controllers/adminController/adminController');




const friendsRouter= express.Router();
friendsRouter.post('/',friendsController.findFriend);
friendsRouter.get('/hola',adminController.hola);

module.exports =  friendsRouter;