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
const userRouter = express.Router();

//nested routes

userRouter.use('/contacts',contactRouter);

// Free routes
userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);



//Protected Routes

userRouter.use(authController.protectRoute);
userRouter.get('/getIn',authController.getIn);
userRouter.post('/findFriends',userController.getContactsWithin,userController.findFriends);


userRouter.delete('/deleteMe', userController.deleteMe);
userRouter.get('/me', userController.getMe, userController.getUser);
userRouter.patch('/updateMe', userController.updateUser);
userRouter.patch('/updatePassword', authController.updatePassword);

userRouter.post('/addFriend',userController.addFriend);


//Restrict to admin Routes

userRouter.use(authController.restrictTo('admin'));

userRouter.route('/').get(authController.getUsers);

userRouter
  .route('/:id')
  .delete(authController.deleteUser)
  .get(userController.getUser);



/*

userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);



//Restrict to admin Routes

userRouter.use(authController.restrictTo('admin'));

userRouter.route('/').get(authController.getUsers);

userRouter
  .route('/:id')
  .delete(authController.deleteUser)
  .get(userController.getUser);
  */

module.exports = userRouter;
