const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');

router.post('/create', pollController.createPoll);     // Admin route
router.get('/', pollController.getPolls);              // Get all polls
router.post('/vote', pollController.votePoll);         // Vote on a poll
router.get('/results/:pollId', pollController.getPollResults);  // Get poll results

module.exports = router;
