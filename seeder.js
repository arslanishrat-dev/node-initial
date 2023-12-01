const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env'});

// load models
const Course = require('./models/Course');
const Subject = require('./models/Subject');

// connecting db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
const subjects = JSON.parse(fs.readFileSync(`${__dirname}/_data/subjects.json`, 'utf-8'));

const importData = async() => {
    try {
        await Course.create(courses);
        await Subject.create(subjects);
        console.log('Data imported successfully...');
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

const deleteData = async() => {
    try {
        await Course.deleteMany();
        await Subject.deleteMany();
        console.log('Data deleted successfully...');
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

if(process.argv[2] === '-i') {
    importData();
} else if(process.argv[2] === '-d') {
    deleteData();
}