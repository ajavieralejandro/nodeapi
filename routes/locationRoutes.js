//requirements
const express = require('express');
const contactRouter = require('./contactRoutes');
const multer = require('multer');
const upload = multer({
  dest : 'public/img/users'
});
//Controllers
const authController = require('../controllers/authController/authController');
const userController = require('../controllers/userController/userController');
const locationController = require('../controllers/locationController/locationController');
const locationRouter = express.Router();



//Protected Routes

locationRouter.use(authController.protectRoute);
locationRouter.get('/locations',locationController.getLocations);
locationRouter.post('/setCurrentLocation',locationController.setCurrentLocation);
locationRouter.get('/updateLocations',locationController.updateLocations);
locationRouter.get('/getRedLocations',locationController.getRedLocations);





module.exports = locationRouter;
