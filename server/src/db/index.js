const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-cred.json');
const fs = require('fs');
const { items , tree } = require('./defaultData.js');

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

if (process.env.PROD_ENV === "pop") {
  populateDb()
}

export const uploadFile = async (req) => await new Promise( resolve => {
  console.log("uploadFile");
  const file = req.files.image;
  // const user = req.user;
  // console.log(file);
  // const flieName = `${user.username}_${file.name}`
  const fileName = file.name;
  fs.writeFile(fileName, file.data, () => {
    console.log("file written")
    bucket.upload(fileName, function(err, file, apiResponse) {
      // console.log("upload", {file}, { apiResponse });
    })
    // const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`)
  })
  // const blob = bucket.file(req.files.image);
  // const blobStream = blob.createWriteStream(req.files.image.data);

  // blobStream.on('finish', () => {
    // The public URL can be used to directly access the file via HTTP.
    // const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
    // console.log({publicUrl})
    // resolve(publicUrl);
  // });

})

export const addUserDefaultData = async (userEmail) => {
  db.collection('trees').doc(userEmail).set(tree);
  items.forEach(it => db.collection(userEmail).doc(it.id).set(it) )
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