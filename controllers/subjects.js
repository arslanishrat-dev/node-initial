const Subject = require('../models/Subject');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

exports.getSubjects = asyncHandler(async (req, res)=> {
    let query;
    console.log(req.params);
    if(req.params.courseId) {
        query = Subject.find({ course: req.params.courseId});
    } else {
        query = Subject.find().populate({
            path: 'course',
            select: 'title description'
        });
    }

    let subjects = await query;

    res.status(200).json({
        success: true,
        count: subjects.length,
        data: subjects
    })
});