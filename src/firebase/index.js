import firebase from "firebase";
import firebaseConfig from "./firebase.config.json";

const firebaseApp = firebase.initializeApp(firebaseConfig);

export { firebaseApp, firebase };
