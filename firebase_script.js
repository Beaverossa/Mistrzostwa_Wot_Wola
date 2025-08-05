let db;

window.addEventListener('DOMContentLoaded', () => {
  const firebaseConfig = {
    apiKey: "AIzaSyAGIqIV-7oeMGa4EHGSQn-wGzo20jcL1aU",
    authDomain: "czolgi-online.firebaseapp.com",
    projectId: "czolgi-online",
    storageBucket: "czolgi-online.appspot.com",
    messagingSenderId: "586260490520",
    appId: "1:586260490520:web:afa5fe105c17cb5479566d"
  };

  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
});
