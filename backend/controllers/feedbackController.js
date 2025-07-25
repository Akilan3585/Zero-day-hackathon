const { collection, addDoc, getDocs, query, where } = require('firebase/firestore');
const { db } = require('../config/firebase');

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { eventId, userId, rating, comments } = req.body;

    const docRef = await addDoc(collection(db, 'feedbacks'), {
      eventId,
      userId,
      rating,        // number from 1-5
      comments,      // optional
      timestamp: new Date()
    });

    res.status(201).json({ message: 'Feedback submitted successfully', id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get feedback for an event
exports.getFeedbackForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const q = query(collection(db, 'feedbacks'), where('eventId', '==', eventId));
    const snapshot = await getDocs(q);

    const feedbackList = [];
    let totalRating = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      totalRating += data.rating;
      feedbackList.push(data);
    });

    const averageRating = feedbackList.length > 0 ? (totalRating / feedbackList.length).toFixed(1) : 0;

    res.status(200).json({
      total: feedbackList.length,
      averageRating,
      feedback: feedbackList
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
