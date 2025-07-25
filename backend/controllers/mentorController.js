const { db } = require("../config/firebase");
const { collection, addDoc, getDocs, query, where } = require("firebase/firestore");

// POST /create
exports.createMentor = async (req, res) => {
  try {
    const { userId, name, skills, bio } = req.body;

    if (!userId || !name || !skills) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const docRef = await addDoc(collection(db, "mentors"), {
      userId,
      name,
      skills,
      bio: bio || "",
    });

    res.status(201).json({ message: "Mentor listed successfully", id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /
exports.getAllMentors = async (req, res) => {
  try {
    const q = query(collection(db, "mentors"));
    const snapshot = await getDocs(q);

    const mentors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(mentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /:userId
exports.getMentorByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const q = query(collection(db, "mentors"), where("userId", "==", userId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({ message: "No mentor found for this user" });
    }

    const mentorData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(mentorData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
