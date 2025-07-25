const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemcontroller');
const multer = require('multer');

// Configure image uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Create Lost/Found Item
// router.post('/report', upload.single('image'), itemController.createItem);

// Get All Items (with filters)
router.get('/search', itemController.searchItems);


// Get Single Item
router.get('/:id', itemController.getItem);

// Mark Item as Resolved
router.put('/resolve/:id', itemController.markResolved);

module.exports = router;
