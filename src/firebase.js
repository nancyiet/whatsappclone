// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";


const firebaseConfig = {
    apiKey: "AIzaSyBPsgXpDnMpZOsj1r6sYhsSYPap4RpHuak",
    authDomain: "whatsapp-clone-f98f0.firebaseapp.com",
    databaseURL: "https://whatsapp-clone-f98f0.firebaseio.com",
    projectId: "whatsapp-clone-f98f0",
    storageBucket: "whatsapp-clone-f98f0.appspot.com",
    messagingSenderId: "1066761895565",
    appId: "1:1066761895565:web:80a33d2ac1fc9e7a236cc4",
    measurementId: "G-KB5LTV0SYS"
  };
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();
  const provider = new firebase.auth.GoogleAuthProvider();
  //firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  export {auth , provider,storage};
  export default db;