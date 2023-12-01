const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = {...err};
    console.log(err);

    error.message = err.message;

    // unknown or wrong parameter or objectId error
    if(err.name === 'CastError') {
        const message = `Resource not found with the id ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // duplicate error
    if(err.code === 11000) {
        const message = `Duplicate Field Entered`;
        error = new ErrorResponse(message, 400);
    }

    if(err.name === "ValidationError") {
        const message = Object.values(err.errors).map(show=> show.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({  
        success: false,
        error: error.message || "Server Error"
    });
}

module.exports = errorHandler;