const express = require("express");
const router = express.Router();
const timetableController = require("../controllers/timetableController");

// CRUD routes
router.post("/timetable", timetableController.addTimetableEntry);
router.get("/timetable/:userId", timetableController.getTimetable);
router.put("/timetable/:id", timetableController.updateTimetableEntry);
router.delete("/timetable/:id", timetableController.deleteTimetableEntry);

module.exports = router;
