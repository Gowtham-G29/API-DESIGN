
const express=require('express');
const userController=require('../controllers/userController');
//ROUTES
const userRouter=express.Router();


//User route
userRouter.route('/').get(userController.getAllUsers).post(userController.createUsers);
userRouter.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);


module.exports=userRouter;