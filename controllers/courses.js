const path = require('path');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

exports.createCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.create(req.body);    

    res.status(201).json({
        success: true,
        data: course
    });
});

exports.showCourses = asyncHandler(async (req, res, next) => {
    let query;
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(rem=> delete reqQuery[rem]);
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=> `$${match}`);

    query = Course.find(JSON.parse(queryStr)).populate('subjects');
    
    if(req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else 
        query = query.sort('-createdAt');

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 2;
    const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;
    const total = await Course.countDocuments();

    const pagination = {};

    query = query.skip(startIndex).limit(limit);

    const courses = await query;

    if(startIndex > 0) {
        pagination.prev = {
            page: page - 1
        }
    }

    if(lastIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    res.status(200).json({
        success: true,
        pagination, 
        data: courses
    });
});

exports.showCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if(!course) {
        return next(new ErrorResponse(`Course not found with the id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true, 
        data: course
    });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!course) {
        return res.status(400).json({
                    success: false, 
                    data: "no data found"
                });
    }

    res.status(200).json({
        success: true, 
        data: course
    });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if(!course) {
        return res.status(400).json({
                    success: false, 
                    data: "no data found"
                });
    }

    course.remove();

    res.status(200).json({
        success: true, 
        data: "Course Is Deleted Successfully"
    });
});

exports.uploadCoursePhoto = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if(!course) {
        return next(new ErrorResponse(`Course not found with the id of ${req.params.id}`, 404));
    }

    if(!req.files) {
        return next(new ErrorResponse(`Please Upload A Photo`, 400));
    }

    const file = req.files.file;

    // check if the uploaded file is an image
    if(!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please Upload An Image`, 400));
    }

    // check the size of the image
    if(file.size > process.env.MAX_UPLOAD_SIZE) {
        return next(new ErrorResponse(`Image size cannot be more than ${MAX_UPLOAD_SIZE}`, 400));
    }

    let t = new Date();

    // generate custom file name
    file.name = `${path.parse(file.name).name}_${t.getHours()}${t.getMinutes()}${t.getSeconds()}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err) {
            return next(new ErrorResponse(err, 400));
        }

        await Course.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name,
        })
    });
});