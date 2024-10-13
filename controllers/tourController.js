/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable prettier/prettier */
const Tour = require('../models/tourModel');

// Commented-out parts can be kept for future use if needed
// const fs = require('fs');
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// Uncomment this if you want to check the ID before proceeding
// exports.checkID = (req, res, next, val) => {
//     console.log(`Tour id is: ${val}`);
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: "failed",
//             message: "Invalid ID"
//         });
//     }
//     next();
// }



exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};




exports.getAllTours = async (req, res) => {

    try {

        //Build a query 

        //1)basic filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);



        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        JSON.parse(queryStr);

        let query = Tour.find(JSON.parse(queryStr));

        // 2) Sorting
        console.log(req.query);

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt'); // Default sorting
        }

        //3)fields limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v')
        }

        //4)pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) {
                throw new Error('This page doesnt exist ');
            }
        }



        //Execute the query
        const tours = await query;

        //Send response
        res.status(200).json({
            status: 'success',
            // Uncomment these if you want to return actual data
            results: tours.length,
            data: {
                tours
            }
        });
    }
    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }

};



exports.createTours = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: "success",  // Fixed typo
            data: {
                tour: newTour
            }
        });


    } catch (err) {
        res.status(404).json({  // Fixed the error response
            status: 'fail',
            message: err.message  // Added `err.message` for clarity
        });
    }
};

exports.getTour = async (req, res) => {

    try {
        const tour = await Tour.findById(req.params.id);
        //Tour.findOne({_id:req.params.id})

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });

    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }


};



exports.updateTour = async (req, res) => {
    try {

        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(201).json({
            status: "success",
            data: {
                tour
            }
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }


};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: null,
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }

                }
            },
            {
                $sort: { avgPrice: 1 }
            }


        ])

        console.log(stats)

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        })

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

//Business problem get a busiest month
exports.getMontlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1; // Convert year to number
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' }, // Correct field reference
                    numToursStarts: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                    _id: 0 // Exclude the _id field from the output
                }
            },
            {
                $sort: {
                    numToursStarts: -1 // Sort by numToursStarts in descending order
                }
            },
            {
                $limit: 6 // Limit the results to 6
            }
        ]);

        res.status(200).json({ // Fixed typo here
            status: 'success',
            data: {
                plan
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};
