// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDh7HNtpoCQr3Vjhs2QOGvU8L2_uxxtITk",
  authDomain: "livescorecart.firebaseapp.com",
  projectId: "livescorecart",
  storageBucket: "livescorecart.firebasestorage.app",
  messagingSenderId: "1085509760094",
  appId: "1:1085509760094:web:ca22113040a03d0fc4f0cf",
  databaseURL: "https://1:1085509760094:web:ca22113040a03d0fc4f0cf.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Connect Firestore to Emulator in Development Mode
if (window.location.hostname === "localhost") {
  connectFirestoreEmulator(db, "localhost", 8080);
}


export {db};