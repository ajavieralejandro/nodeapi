//requirements
const express = require('express');
const authController = require('../controllers/authController/authController');
const userController = require('../controllers/userController/userController');

const userRouter = express.Router();

// Free routes
userRouter.post('/signup', authController.signup);

/*

userRouter.post('/login', authController.login);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

//Protected Routes

userRouter.use(authController.protectRoute);
userRouter.delete('/deleteMe', userController.deleteMe);
userRouter.get('/me', userController.getMe, userController.getUser);
userRouter.patch('/updateMe', userController.updateUser);
userRouter.patch('/updatePassword', authController.updatePassword);

//Restrict to admin Routes

userRouter.use(authController.restrictTo('admin'));

userRouter.route('/').get(authController.getUsers);

userRouter
  .route('/:id')
  .delete(authController.deleteUser)
  .get(userController.getUser);
  */

module.exports = userRouter;
