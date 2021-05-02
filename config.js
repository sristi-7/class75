import * as firebase from "firebase" 
require("@firebase/firestore")

var firebaseConfig = {
    apiKey: "AIzaSyBwNCltHIdsoc7wJZxuFidMTWerhHH5scQ",
    authDomain: "willy-654d2.firebaseapp.com",
    projectId: "willy-654d2",
    storageBucket: "willy-654d2.appspot.com",
    messagingSenderId: "746352922076",
    appId: "1:746352922076:web:88f8a32961e978a2b69319"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore()