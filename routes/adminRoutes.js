const express = require('express');
const authController = require('../controllers/authController/authController');
const userController = require('../controllers/userController/userController');
const contactsController = require('../controllers/contactsController/contactsController');
const adminController = require('../controllers/adminController/adminController');


const adminRouter = express.Router();
adminRouter.get('/',userController.getAllUsers);
adminRouter.get('/hola',adminController.hola);
module.exports =  adminRouter;