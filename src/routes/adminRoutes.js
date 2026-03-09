const express = require('express');
const { getAllUsers } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/users', protect, authorizeRoles('admin'), getAllUsers);

module.exports = router;
