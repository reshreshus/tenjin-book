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

export const addUser = async (user) => {
  console.log("addUser");
  db.collection('users').doc(user.email).set(user);
}

export const getUserByEmail = async (userEmail) => {
  // const doc = await db.collection('users').where('email', '==', userEmail);
  const doc = await db.collection('users').doc(userEmail).get()
  return returnDocData(doc);
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

export const insertItem = async (userId, item) => {
  if (userId)
    db.collection(userId).doc(item.id).set(item);
}

export const getItems = async (userId) => {
  const snapshot = await db.collection(userId).get();
  return snapshot.docs.map(doc => doc.data());
}

const addZero = (number) => {
  return `0${number}`.slice(-2);
}

const getDate = (dt = new Date()) => {
  return `${dt.getFullYear()}-${addZero(dt.getMonth() + 1)}-${addZero(dt.getDate())}-${addZero(dt.getHours())}-${addZero(dt.getMinutes())}-${addZero(dt.getSeconds())}`
  // return dt.toISOString();
}

const returnDocData = (doc) => {
  if (!doc.exists) {
    console.log('No such document');
    return null;
  } else {
    return doc.data();
  }
}