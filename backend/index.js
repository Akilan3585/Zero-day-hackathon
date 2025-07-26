const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config(); // For .env config

const itemRoutes = require('./routes/itemRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const announcementRoutes = require("./routes/announcementRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const mentorRoutes=require("./routes/mentorRoutes.js");
const bookingRoutes = require('./routes/bookingRoutes');
const upskillingRoutes = require('./routes/upskillingRoutes');
const curatedRoutes = require('./routes/curatedRoutes');
const lostFoundRoutes = require('./routes/lostFoundRoutes');
const pollRoutes = require('./routes/pollRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────
app.use(cors("*"));
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // For form data

// Serve static files (for image uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/items', itemRoutes);
app.use('/api/complaints', complaintRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/mentor",mentorRoutes);
app.use('/api/book', bookingRoutes);
app.use("/api/upskilling", upskillingRoutes);
app.use("/api/resources", curatedRoutes);
app.use('/api/lostfound', lostFoundRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/feedback', feedbackRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
