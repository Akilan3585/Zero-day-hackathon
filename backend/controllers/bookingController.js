const { db } = require('../config/firebase');
const { collection, addDoc, getDocs } = require('firebase/firestore');

exports.bookSession = async (req, res) => {
  try {
    const { studentName, mentorId, skill, slot } = req.body;

    const bookingRef = await addDoc(collection(db, 'bookings'), {
      studentName,
      mentorId,
      skill,
      slot,
    });

    res.status(201).json({ id: bookingRef.id, message: 'Session booked successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, 'bookings'));
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
