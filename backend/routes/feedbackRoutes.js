const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Route to submit feedback
router.post('/submit', feedbackController.submitFeedback);

// Route to get feedback for an event
router.get('/event/:eventId', feedbackController.getFeedbackForEvent);

module.exports = router;
