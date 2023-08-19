import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {getFirestore} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js"; 
import { getAuth,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getStorage} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyDssB1GnXNoqOBJIoFZU6Mt2lSdY-6bkvY",
  authDomain: "chat-app-b630e.firebaseapp.com",
  databaseURL: "https://chat-app-b630e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-app-b630e",
  storageBucket: "chat-app-b630e.appspot.com",
  messagingSenderId: "1025472916860",
  appId: "1:1025472916860:web:bb9d1a91b34867cb3e48f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 
  const db=getFirestore(app)
  const auth = getAuth(app);
  const storage = getStorage();

  onAuthStateChanged(auth, (user) => {
    let uid=localStorage.getItem("uid")
    console.log(uid)
    if (user && uid ) {
  
  
        if(location.pathname !=='/profile.html' && location.pathname !== '/dash.html')
        {
          location.href='profile.html'
        }}
  
      else{
          if(location.pathname!=='/index.html' && location.pathname!=="/login.html")
          {
            location.href='index.html'
          }
        }
  });


export {app,db,auth,storage,onAuthStateChanged}