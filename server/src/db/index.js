const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-cred.json');
const { items , tree } = require('./defaultData.js');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tenjin-book.firebaseio.com"
});

const db = admin.firestore();

const populateDb = () => {
  db.collection('trees').doc('dummy').set(tree);
  items.forEach(it => db.collection('dummy').doc(it.id).set(it));
}

if (process.env.PROD_ENV === "pop") {
  populateDb()
}

const returnDocData = (doc) => {
  if (!doc.exists) {
    console.log('No such document');
    return null;
  } else {
    return doc.data();
  }
}

export const updateItem = async (userId, itemId, item) => {
  console.log("updateItem", userId);
  if (userId && itemId)
    db.collection(userId).doc(itemId).set(item);
}

export const updateTree = async (userId, tree) => {
  console.log("updateTree", userId);
  if (userId)
    db.collection('trees').doc(userId).set(tree);
}

export const getItem = async (userId, itemId) => {
  if (userId && itemId) {
    const doc = await db.collection(userId).doc(itemId).get();
    return returnDocData(doc);
  } else {
    console.log("getItem", userId, itemId);
  }
}

export const getTree = async (userId) => {
  // console.log("getTree", userId);
  if (userId) {
    const doc = await db.collection('trees').doc(userId).get();
    return returnDocData(doc);
  }
}

export const getItems = async (userId) => {
  const snapshot = await db.collection(userId).get();
  return snapshot.docs.map(doc => doc.data());
}