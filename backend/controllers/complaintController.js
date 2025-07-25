const { db } = require("../config/firebase");
const {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
} = require("firebase/firestore");

// ✅ Create Complaint
exports.createComplaint = async (req, res) => {
  try {
    const complaintData = {
      ...req.body,
      submittedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "complaints"), complaintData);
    const newDoc = await getDoc(doc(db, "complaints", docRef.id));

    res.status(201).json({
      message: "✅ Complaint registered",
      complaint: { id: docRef.id, ...newDoc.data() },
    });
  } catch (err) {
    console.error("Error registering complaint:", err);
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get All Complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const q = query(collection(db, "complaints"), orderBy("submittedAt", "desc"));
    const snapshot = await getDocs(q);

    const complaints = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(complaints);
  } catch (err) {
    console.error("Error getting complaints:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Complaint Status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const docRef = doc(db, "complaints", id);
    const existingDoc = await getDoc(docRef);

    if (!existingDoc.exists()) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    await updateDoc(docRef, { status });
    const updatedDoc = await getDoc(docRef);

    res.json({
      message: "✅ Status updated",
      updated: { id: updatedDoc.id, ...updatedDoc.data() },
    });
  } catch (err) {
    console.error("Error updating complaint:", err);
    res.status(500).json({ error: err.message });
  }
};
