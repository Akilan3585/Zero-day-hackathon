const express = require('express');
const router = express.Router();
const upskillingController = require('../controllers/upskillingController');
const adminAuth = require("../middleware/adminAuthMiddleware");

router.post('/create', adminAuth, upskillingController.createSession);
router.get('/open', upskillingController.getOpenSessions);
router.post('/book', upskillingController.bookSession);

module.exports = router;
