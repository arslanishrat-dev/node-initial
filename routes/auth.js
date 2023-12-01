const express = require('express');
const { registerUser, showUsers, login, showLoggedIn } = require('../controllers/auth');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.route('/registerUser').post(registerUser);
router.route('/showUsers').get(showUsers);
router.route('/login').post(login);
router.route('/showLoggedIn').get(protect, showLoggedIn);

module.exports = router;