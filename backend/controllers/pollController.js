const { db } = require('../config/firebase');
const { collection, addDoc, getDocs,getDoc, doc, updateDoc, increment, query, where } = require('firebase/firestore');

// Create a new poll (admin only)
exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !options || options.length < 2) {
      return res.status(400).json({ error: 'Question and at least two options are required.' });
    }

    const poll = {
      question,
      options: options.map(option => ({ text: option, votes: 0 })),
      createdAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'polls'), poll);

    res.status(201).json({ id: docRef.id, message: 'Poll created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all polls
exports.getPolls = async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'polls'));
    const polls = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Vote on a poll
exports.votePoll = async (req, res) => {
  try {
    const { pollId, optionIndex } = req.body;

    const pollRef = doc(db, 'polls', pollId);
    const optionPath = `options.${optionIndex}.votes`;

    await updateDoc(pollRef, {
      [optionPath]: increment(1)
    });

    res.status(200).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get poll results by poll ID
exports.getPollResults = async (req, res) => {
  try {
    const { pollId } = req.params;

    const pollRef = doc(db, 'polls', pollId);
    const pollSnap = await getDoc(pollRef);

    if (!pollSnap.exists()) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    const pollData = pollSnap.data();
    const totalVotes = pollData.options.reduce((sum, option) => sum + option.votes, 0);

    const results = pollData.options.map((option, index) => ({
      option: option.text,
      votes: option.votes,
      percentage: totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(2) + '%' : '0.00%'
    }));

    res.status(200).json({
      question: pollData.question,
      totalVotes,
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
