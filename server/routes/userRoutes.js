const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/:walletAddress', userController.getUser);
router.put('/profile', protect, userController.updateProfile);

module.exports = router;
