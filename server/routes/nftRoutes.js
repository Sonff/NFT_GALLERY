const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nftController');

router.get('/:walletAddress', nftController.getNfts);

module.exports = router;
