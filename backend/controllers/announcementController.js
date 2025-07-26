const { db } = require("../config/firebase");
const { collection, addDoc, getDocs, query, orderBy, where } = require("firebase/firestore");

// POST: Create Announcement (admin)
exports.createAnnouncement = async (req, res) => {
  try {
    console.log('Received announcement data:', req.body);
    
    const { title, description, category, tag, announcementDate, author, userRole } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    // Check if user is admin
    if (userRole !== 'admin' && author !== 'Admin') {
      return res.status(403).json({ error: "Only administrators can create announcements" });
    }

    const newAnnouncement = {
      title,
      description,
      category: category || tag || 'General', // Handle both category and tag
      tag: tag || category || 'General', // Store both for compatibility
      announcementDate: announcementDate ? new Date(announcementDate).toISOString() : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      author: author || "Admin",
      userRole: userRole || 'admin'
    };

    console.log('Creating announcement in Firebase:', newAnnouncement);

    const docRef = await addDoc(collection(db, "announcements"), newAnnouncement);

    const responseData = {
      _id: docRef.id,
      ...newAnnouncement
    };

    console.log('Announcement created successfully:', responseData);

    res.status(201).json(responseData);
  } catch (err) {
    console.error('Error creating announcement:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET: View Announcements (students)
exports.getAnnouncements = async (req, res) => {
  try {
    const { category } = req.query;

    let announcementsQuery = query(collection(db, "announcements"), orderBy("createdAt", "desc"));

    if (category) {
      announcementsQuery = query(
        collection(db, "announcements"),
        where("category", "==", category),
        orderBy("createdAt", "desc")
      );
    }

    const snapshot = await getDocs(announcementsQuery);

    const announcements = snapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    }));

    console.log(`Retrieved ${announcements.length} announcements`);
    res.json(announcements);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ error: err.message });
  }
};
