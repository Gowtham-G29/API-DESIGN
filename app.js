/* eslint-disable no-use-before-define */
/* eslint-disable prettier/prettier */
const express = require('express');
const app = express();


if(process.NODE_EV==='development'){
    app.use(morgan('dev'));
}

const morgan = require('morgan');

const tourRouter=require('./routes/tourRoutes');
const userRouter=require('./routes/userRoutes');




//1) MIDDLEWARES
//middleware - middle of the req and res
// middle ware is usually a function that modifies the incoming request data.
app.use(express.json());
app.use(express.static(`${__dirname}/public`));//we can access the static html files using this 


//own middleware -->execute for every request in the server. always in the top level
// app.use((req, res, next) => {
//     console.log('Hello from the middleware'); //logic 
//     //if never call the next the middleware function stuck in the req,res cycle.
//     next();
// });


//ROUTES
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);


//Handling unhandled routes

app.all('*',(req,res,next)=>{
    res.status(404).json({
        status:'fail',
        message:`cant find the ${req.originalUrl} on this server!`
    })
    next();
});

app.use((err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.status=err.status||'error';
    
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message
    })
    next();
})


module.exports=app;


//routing means basically to determine how an applications responds to certain client requests,so to a certain URL