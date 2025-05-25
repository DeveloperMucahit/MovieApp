
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC38f3mKd4moTl407Ch0G8m6H2bWDuSPQ0",
    authDomain: "movieapp-d2304.firebaseapp.com",
    projectId: "movieapp-d2304",
    storageBucket: "movieapp-d2304.firebasestorage.app",
    messagingSenderId: "253418799569",
    appId: "1:253418799569:web:0100bcd64403ed37bee0f0"
  };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firestore();

export { firebase, db };
