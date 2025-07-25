const { db } = require("../config/firebase");
const {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
} = require("firebase/firestore");

// Define the collection reference
const itemsCollection = collection(db, "items");

// Create item
exports.createItem = async (req, res) => {
  try {
    const {
      type,
      name,
      description,
      category,
      eventDate,
      location,
      email,
      phone,
    } = req.body;

    const imageUrl = req.file ? req.file.path : '';

    const newItemData = {
      type,
      name,
      description,
      category,
      eventDate: new Date(eventDate).toISOString(),
      location,
      imageUrl,
      status: 'active',
      contactInfo: {
        email,
        phone,
      },
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(itemsCollection, newItemData);
    const savedDoc = await getDoc(doc(db, "items", docRef.id));

    res.status(201).json({
      message: "✅ Item reported successfully",
      newItem: { id: docRef.id, ...savedDoc.data() },
    });
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get single item
exports.getItem = async (req, res) => {
  try {
    const itemRef = doc(db, "items", req.params.id);
    const snapshot = await getDoc(itemRef);
    
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ id: snapshot.id, ...snapshot.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search items with filters
exports.searchItems = async (req, res) => {
  const { type, category, startDate, endDate, keyword } = req.query;

  try {
    let q = itemsCollection;

    const constraints = [];
    if (type) constraints.push(where('type', '==', type));
    if (category) constraints.push(where('category', '==', category));
    if (startDate && endDate) {
      constraints.push(where('eventDate', '>=', new Date(startDate).toISOString()));
      constraints.push(where('eventDate', '<=', new Date(endDate).toISOString()));
    }

    if (constraints.length > 0) {
      q = query(itemsCollection, ...constraints);
    }

    const snapshot = await getDocs(q);

    const items = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();

      if (
        keyword &&
        !(
          data.name?.toLowerCase().includes(keyword.toLowerCase()) ||
          data.description?.toLowerCase().includes(keyword.toLowerCase())
        )
      ) {
        return;
      }

      items.push({ id: docSnap.id, ...data });
    });

    items.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark item as resolved
exports.markResolved = async (req, res) => {
  try {
    const itemRef = doc(db, "items", req.params.id);

    await updateDoc(itemRef, { status: 'resolved' });

    const updatedDoc = await getDoc(itemRef);

    res.json({
      message: '✅ Item marked as resolved',
      item: { id: updatedDoc.id, ...updatedDoc.data() },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
