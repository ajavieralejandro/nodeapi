const express = require('express');
const authController = require('../controllers/authController/authController');
const userController = require('../controllers/userController/userController');
const contactsController = require('../controllers/contactsController/contactsController');


const contactRouter = express.Router();
contactRouter.use(authController.protectRoute);
contactRouter.get('/test',contactsController.test);
contactRouter.get('/getContactsWithin',contactsController.getContactsWithin);
module.exports = contactRouter;