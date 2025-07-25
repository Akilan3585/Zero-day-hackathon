const { db } = require('../config/firebase');
const { collection, addDoc, getDocs, query, where } = require('firebase/firestore');

// Add a new curated resource
exports.addResource = async (req, res) => {
  try {
    const { type, title, description, link, tags, postedBy } = req.body;
    const docRef = await addDoc(collection(db, 'curatedResources'), {
      type,
      title,
      description,
      link,
      tags,
      postedBy,
      postedAt: new Date().toISOString()
    });

    res.status(201).json({ message: 'Resource added', id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all resources by type
exports.getResourcesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const q = query(collection(db, 'curatedResources'), where('type', '==', type));
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all resources
exports.getAllResources = async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, 'curatedResources'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
