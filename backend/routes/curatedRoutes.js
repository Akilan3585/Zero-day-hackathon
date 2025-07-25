const express = require('express');
const router = express.Router();
const curatedController = require('../controllers/curatedController');

router.post('/add', curatedController.addResource); // add new resource
router.get('/type/:type', curatedController.getResourcesByType); // get by type (e.g., hackathon)
router.get('/all', curatedController.getAllResources); // get all resources

module.exports = router;
