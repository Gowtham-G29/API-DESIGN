/* eslint-disable prettier/prettier */

const express=require('express');
const tourController=require('../controllers/tourController');//can also extracting by destructuring


const tourRouter=express.Router();

// tourRouter.param('id',tourController.checkID);

tourRouter.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTours)

//aggregate pipeline
tourRouter.route('/tour-stats').get(tourController.getTourStats);
tourRouter.route('/monthly-plan/:year').get(tourController.getMontlyPlan);



//Tour routes
tourRouter.route('/').get(tourController.getAllTours).post(tourController.createTours);
tourRouter.route('/:id').patch(tourController.updateTour).get(tourController.getTour).delete(tourController.deleteTour);

module.exports=tourRouter;