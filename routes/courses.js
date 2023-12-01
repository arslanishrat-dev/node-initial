var express = require('express');
var router = express.Router();
const { showCourses, showCourse, createCourse, updateCourse, deleteCourse, uploadCoursePhoto} = require('../controllers/courses');
const { protect, authorize } = require('../middlewares/auth');

const subjectRouter = require('./subjects');
router.use('/:courseId/subjects', subjectRouter);
router.route('/').get(showCourses);
router.route('/createCourse').post(protect, authorize('publisher', 'admin'), createCourse);
router.route('/:id').get(showCourse);
router.route('/updateCourse/:id').put(protect, updateCourse);
router.route('/updateCourse/:id/photo').put(protect, uploadCoursePhoto);
router.route('/deleteCourse/:id').delete(protect, deleteCourse);

module.exports = router;