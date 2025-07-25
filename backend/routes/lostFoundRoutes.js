const express = require('express');
const router = express.Router();
const lostFoundController = require('../controllers/lostFoundController');

router.post('/report', lostFoundController.reportItem);
router.get('/', lostFoundController.getItems);

module.exports = router;
