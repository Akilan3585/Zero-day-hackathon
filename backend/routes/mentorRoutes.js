const express = require("express");
const router = express.Router();
const mentorController = require("../controllers/mentorController");
const adminAuth = require("../middleware/adminAuthMiddleware");

router.post("/create", mentorController.createMentor);
router.get("/getall", mentorController.getAllMentors);
router.get("/:userId", mentorController.getMentorByUserId);
module.exports = router;
