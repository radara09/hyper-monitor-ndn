import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBfwJoBt2kT0iOMjlDBw_heFaqjwjlp5ZU",
    authDomain: "medical-record-7557a.firebaseapp.com",
    databaseURL: "https://medical-record-7557a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "medical-record-7557a",
    storageBucket: "medical-record-7557a.appspot.com",
    messagingSenderId: "973084416066",
    appId: "1:973084416066:web:50c8c2831db284a7e835db",
    measurementId: "G-MZ9NN8VEQZ"
  };
  const app = firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  firebase.initializeApp(firebaseConfig);

  export default firebase