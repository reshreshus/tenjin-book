const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-cred.json');
const fs = require('fs');
const { items , tree } = require('./defaultData.js');
const uuid = require('uuid');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tenjin-book.firebaseio.com",
  storageBucket: "tenjin-book.appspot.com"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const populateDb = () => {
  db.collection('trees').doc('dummy').set(tree);
  items.forEach(it => db.collection('dummy').doc(it.id).set(it));
}

// if (process.env.PROD_ENV === "pop") {
//   populateDb()
// }

export const emailIsUnique = async (email) => {
  const doc = await db.collection('users').doc(email).get()
  if (!doc.exists) {
    return true;
  }
  return false;
}

export const usernameIsUnique = async (username) => {
  const doc = await db.collection('users').where('username', '==', username).get();
  if (doc.empty) {
    return true;
  }
  return false;
}

export const getFile = async (localFilename, remoteFilename) => await new Promise( resolve => {
  bucket.file(remoteFilename).download({ destination: localFilename}).then(() => {
    resolve(localFilename);
  })
})

export const deleteFile = async (fileName) => await new Promise( resolve => {
  console.log("deleteFile");
  // const ref = bucket.child(fileName);
  // ref.delete().then((_ => {
  //   console.log("file deleted");
  // }).catch((err) => {
  //   console.err(err);
  // })
  // )
})

export const uploadFile = async (req, endpoint) => await new Promise( resolve => {
  const file = req.files.image;
  const user = req.user;
  const remoteFilename = `${user.username}/${uuid.v4()}`
  const localFilename = `${user.username}_${file.name}`
  fs.writeFile(localFilename, file.data, () => {
    bucket.upload(localFilename, {destination: remoteFilename}, async function(err, file) {
      fs.unlink(localFilename, () => { });
      const url = `${endpoint}/media/${file.name}`;
      resolve(url);
    })
  })
})

export const addUserDefaultData = async (userEmail) => {
  const exampleData = (await db.collection('trees').doc('example@jinbook.org').get()).data()
  const exampleItems = await getItems('example@jinbook.org');
  if (exampleData && exampleItems) {
    db.collection('trees').doc(userEmail).set(exampleData);
    exampleItems.forEach(it => db.collection(userEmail).doc(it.id).set(it))
  } else {
    db.collection('trees').doc(userEmail).set(tree);
    items.forEach(it => db.collection(userEmail).doc(it.id).set(it))
  }
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

export const updateItem = async (userEmail, itemId, item) => {
  console.log("updateItem", userEmail);
  if (userEmail && itemId)
    db.collection(userEmail).doc(itemId).set(item);
}

export const updateTree = async (userEmail, tree) => {
  console.log("updateTree", userEmail);
  if (userEmail)
    db.collection('trees').doc(userEmail).set(tree);
}

export const getItem = async (userEmail, itemId) => {
  if (userEmail && itemId) {
    const doc = await db.collection(userEmail).doc(itemId).get();
    return returnDocData(doc);
  } else {
    console.log("getItem", userEmail, itemId);
  }
}

export const getTree = async (userEmail) => {
  // console.log("getTree", userEmail);
  if (userEmail) {
    const doc = await db.collection('trees').doc(userEmail).get();
    return returnDocData(doc);
  }
}

export const insertItem = async (userEmail, item) => {
  if (userEmail)
    db.collection(userEmail).doc(item.id).set(item);
}

export const getItems = async (userEmail) => {
  const snapshot = await db.collection(userEmail).get();
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