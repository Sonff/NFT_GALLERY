const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.post('/', protect, favoriteController.addFavorite);
router.delete('/:id', protect, favoriteController.removeFavorite);
router.get('/:walletAddress', favoriteController.getFavorites);

module.exports = router;
