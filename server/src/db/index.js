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



export const getTree = async (userId) => {
  // console.log("getTree", userId);
  if (userId) {
    const doc = await db.collection('trees').doc(userId).get();
    if (!doc.exists) {
      console.log('No such document');
      return null;
    } else {
      return doc.data();
    }
  }
}

export const getItems = async (userId) => {
  const snapshot = await db.collection(userId).get();
  return snapshot.docs.map(doc => doc.data());
}