const { db } = require('../config/firebase'); // adjust path as needed
const { collection, addDoc, getDocs, query, where, Timestamp } = require('firebase/firestore');

exports.reportItem = async (req, res) => {
  try {
    const { 
      itemName, 
      category, 
      status, 
      description, 
      date, 
      location, 
      imageUrl,
      contactName,
      contactEmail,
      contactPhone,
      roomNumber 
    } = req.body;

    const docRef = await addDoc(collection(db, 'lostFound'), {
      itemName,
      category,
      status, // 'lost' or 'found'
      description,
      date: Timestamp.fromDate(new Date(date)),
      location,
      imageUrl,
      contactName,
      contactEmail,
      contactPhone,
      roomNumber,
      createdAt: Timestamp.now()
    });

    res.status(201).json({ id: docRef.id, message: "Item reported successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { category, status, fromDate, toDate } = req.query;

    let q = collection(db, 'lostFound');
    const filters = [];

    if (category) filters.push(where('category', '==', category));
    if (status) filters.push(where('status', '==', status));
    if (fromDate && toDate) {
      filters.push(
        where('date', '>=', Timestamp.fromDate(new Date(fromDate))),
        where('date', '<=', Timestamp.fromDate(new Date(toDate)))
      );
    }

    const finalQuery = filters.length ? query(q, ...filters) : q;
    const querySnapshot = await getDocs(finalQuery);

    const items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
