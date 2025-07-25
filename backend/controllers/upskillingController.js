const { db } = require('../config/firebase');
const { collection, addDoc, getDocs, query, where, updateDoc, doc } = require('firebase/firestore');

// Create session
exports.createSession = async (req, res) => {
  try {
    const { mentorId, skill,experience, description, timeSlot } = req.body;
    const docRef = await addDoc(collection(db, 'upskillingSessions'), {
      mentorId,
      skill,
      experience,
      description,
      timeSlot,
      status: 'open',
      createdAt: new Date().toISOString()
    });
    res.status(201).json({ message: 'Session created', id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all open sessions
exports.getOpenSessions = async (req, res) => {
  try {
    const q = query(collection(db, 'upskillingSessions'), where('status', '==', 'open'));
    const snapshot = await getDocs(q);

    const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Book a session
exports.bookSession = async (req, res) => {
  try {
    const { sessionId, menteeId } = req.body;
    const sessionRef = doc(db, 'upskillingSessions', sessionId);

    await updateDoc(sessionRef, {
      menteeId,
      status: 'booked'
    });

    res.status(200).json({ message: 'Session booked successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
