const express = require('express');
const authController = require('../controllers/authController/authController');
const userController = require('../controllers/userController/userController');
const contactsController = require('../controllers/contactsController/contactsController');


const contactRouter = express.Router();
contactRouter.use(authController.protectRoute);
contactRouter.get('/updateContacts',contactsController.updateContacts);
contactRouter.get('/test',contactsController.test);
contactRouter.get('/getContactsWithin',contactsController.getContactsWithin);
contactRouter.get('/',contactsController.getUserContacts);

module.exports = contactRouter;