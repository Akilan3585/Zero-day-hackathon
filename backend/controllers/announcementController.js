const { db } = require("../config/firebase");
const { collection, addDoc, getDocs, query, orderBy, where } = require("firebase/firestore");

// POST: Create Announcement (admin)
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, description, category, announcementDate, author } = req.body;

    const newAnnouncement = {
      title,
      description,
      category,
      announcementDate: new Date(announcementDate).toISOString(),
      createdAt: new Date().toISOString(),
      author: author || "Admin",
    };

    const docRef = await addDoc(collection(db, "announcements"), newAnnouncement);

    res.status(201).json({
      message: "📢 Announcement created successfully",
      id: docRef.id,
      data: newAnnouncement,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: View Announcements (students)
exports.getAnnouncements = async (req, res) => {
  try {
    const { category } = req.query;

    let announcementsQuery = query(collection(db, "announcements"), orderBy("announcementDate", "desc"));

    if (category) {
      announcementsQuery = query(
        collection(db, "announcements"),
        where("category", "==", category),
        orderBy("announcementDate", "desc")
      );
    }

    const snapshot = await getDocs(announcementsQuery);

    const announcements = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
