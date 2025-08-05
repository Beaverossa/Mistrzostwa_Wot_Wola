// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyAGIqIV-7oeMGa4EHGSQn-wGzo20jcL1aU",
  authDomain: "czolgi-online.firebaseapp.com",
  projectId: "czolgi-online",
  storageBucket: "czolgi-online.appspot.com",  // poprawione
  messagingSenderId: "586260490520",
  appId: "1:586260490520:web:afa5fe105c17cb5479566d",
  measurementId: "G-2K5GFY7K9P"
};

// Initialize Firebase app and analytics
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();

async function saveTankList(name, tanks) {
  await db.collection('tankLists').doc(name).set({
    tanks: tanks,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

async function getTankList(name) {
  const doc = await db.collection('tankLists').doc(name).get();
  if (doc.exists) return doc.data().tanks;
  return null;
}

async function getAllUsers() {
  const snapshot = await db.collection('tankLists').get();
  return snapshot.docs.map(doc => doc.id);
}

async function deleteUser(name) {
  await db.collection('tankLists').doc(name).delete();
}

async function saveMatchResult(result) {
  await db.collection('matchResults').add({
    ...result,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}

async function getMatchResults() {
  const snapshot = await db.collection('matchResults').orderBy('timestamp', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function deleteMatchResult(id) {
  await db.collection('matchResults').doc(id).delete();
}
