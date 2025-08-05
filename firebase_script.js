// firebase_script.js

// Konfiguracja Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAGIqIV-7oeMGa4EHGSQn-wGzo20jcL1aU",
  authDomain: "czolgi-online.firebaseapp.com",
  projectId: "czolgi-online",
  storageBucket: "czolgi-online.appspot.com",
  messagingSenderId: "586260490520",
  appId: "1:586260490520:web:afa5fe105c17cb5479566d",
  measurementId: "G-2K5GFY7K9P"
};

// Inicjalizacja
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
