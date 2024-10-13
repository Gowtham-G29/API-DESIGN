/* eslint-disable import/newline-after-import */
/* eslint-disable prettier/prettier */
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const mongoose = require('mongoose');

const Tour = require('../../models/tourModel');



//established database connections
const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB connection is establised");
});

//READ json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//Import data into DB
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data is successfully loaded');
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

//Delete all the data from the database

const deleteData = async () => {
    try {
        await Tour.deleteMany({});
        console.log('All the documents are deleted');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

if(process.argv[2]==='--import'){
    importData();
}else if(process.argv[2]==='--delete'){
    deleteData();
}


//run the file in command line


//node dev-data/data/import-dev-data.js --import or --delete