const express = require('express');
const dotenv = require('dotenv');
const courses = require('./routes/courses');
const subjects = require('./routes/subjects');
const auth = require('./routes/auth');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');

dotenv.config({ path: './config/config.env'});

connectDB();

const app = express();

// body parser
app.use(express.json());

app.use(fileUpload());

// route files
app.use('/api/courses', courses);
app.use('/api/subjects', subjects);
app.use('/api/auth', auth);

app.use(errorHandler);


var PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`server is running in ${process.env.NODE_ENV} and the port is ${PORT}`));

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1));
});