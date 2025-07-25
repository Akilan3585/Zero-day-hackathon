const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcementController");
const adminAuth = require("../middleware/adminAuthMiddleware");

// Admin creates a new announcement (restricted)
router.post("/announcements", adminAuth, announcementController.createAnnouncement);

// Students view announcements (no restriction)
router.get("/announcements", announcementController.getAnnouncements);

module.exports = router;
