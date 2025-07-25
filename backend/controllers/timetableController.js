const { db } = require("../config/firebase");
const {
  collection,
  addDoc,
  getDoc,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc
} = require("firebase/firestore");

// ✅ Create timetable entry
exports.addTimetableEntry = async (req, res) => {
  try {
    const {
      userId,
      day,
      subject,
      startTime,
      endTime,
      location,
      faculty
    } = req.body;

    // ✅ Validate required fields
    if (!userId || !day || !subject || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const newEntry = {
      userId,
      day,
      subject,
      startTime,
      endTime,
      location: location || "", // Optional
      faculty: faculty || "",   // Optional
      createdAt: new Date().toISOString(),
    };

    // ✅ Add document to Firestore
    const docRef = await addDoc(collection(db, "timetables"), newEntry);

    // ✅ Retrieve the newly added document
    const savedDoc = await getDoc(doc(db, "timetables", docRef.id));

    res.status(201).json({
      message: "✅ Timetable entry added successfully",
      newEntry: { id: docRef.id, ...savedDoc.data() },
    });
  } catch (err) {
    console.error("❌ Error adding timetable entry:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// 📅 Get timetable for a user
exports.getTimetable = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const q = query(collection(db, "timetables"), where("userId", "==", userId));
    const snapshot = await getDocs(q);

    const timetable = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(timetable);
  } catch (err) {
    console.error("❌ Error fetching timetable:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// ✏️ Update timetable entry
exports.updateTimetableEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: "Timetable ID is required." });
    }

    const docRef = doc(db, "timetables", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Timetable entry not found." });
    }

    await updateDoc(docRef, updateData);

    res.status(200).json({ message: "✅ Timetable entry updated successfully." });
  } catch (err) {
    console.error("❌ Error updating timetable entry:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// ❌ Delete timetable entry
exports.deleteTimetableEntry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Timetable ID is required." });
    }

    const docRef = doc(db, "timetables", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Timetable entry not found." });
    }

    await deleteDoc(docRef);
    res.status(200).json({ message: "🗑️ Timetable entry deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting timetable entry:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
