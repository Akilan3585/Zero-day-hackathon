const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');

router.post('/', complaintController.createComplaint);
router.get('/', complaintController.getAllComplaints);
router.patch('/:id/status', complaintController.updateComplaintStatus);

module.exports = router;
