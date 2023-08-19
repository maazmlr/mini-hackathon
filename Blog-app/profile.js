import {app, auth,db,storage } from "./firebase.js";
import { onAuthStateChanged,signOut,EmailAuthProvider,updatePassword} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import { getFirestore,doc, setDoc ,getDoc,updateDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";



const logoutBtn = document.querySelector(".logout-btn")

logoutBtn && logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        localStorage.clear()
        location.href = "login.html"
    }).catch((error) => {
        // An error happened.
    });
    
})


const changeName = document.getElementById("changeName")
const logo = document.getElementById("logo")
let fr = true
logo?.addEventListener("click", () => {
    
  if (fr) {
    changeName.disabled = false;
    fr = false;
    changeName.style.border = "1px solid black"
  }
  else {
    changeName.disabled = true;
    fr = true
    changeName.style.border = "none"
  }
})


const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    if (file) {
      if (
        file.type.slice(6) == "png" ||
        file.type.slice(6) == "jpeg" ||
        file.type.slice(6) == "jpg"
      ) {
        let name = file.name;
        const mountainsRef = ref(storage, `images/${name}`);
        const uploadTask = uploadBytesResumable(mountainsRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Image should be in 'PNG, JPEG or JPG' format",
        });
      }
    }
  });
};


const fileInput = document.getElementById("file-input");

fileInput?.addEventListener("change", async () => {
  if (
    fileInput.files[0].type === "image/jpg" ||
    fileInput.files[0].type === "image/png" ||
    fileInput.files[0].type === "image/jpeg"
  ) {
    try {
      userProfile.src = URL.createObjectURL(fileInput.files[0]);
    } catch (err) {
      console.log();
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Image should be in 'PNG, JPEG or JPG' format",
    });
  }
});

const updateProfile = document.querySelector(".update-btn");
const userProfile = document.getElementById("userProfile")

updateProfile &&
  updateProfile.addEventListener("click", async () => {
    let uid = localStorage.getItem("uid");
    let oldpass=document.getElementById("old-password")
    let newPass=document.getElementById("new-password")
    const password = (localStorage.getItem('password'));
    console.log(oldpass.value)
    console.log("click")
    
    if(password===oldpass.value){
        const user = auth.currentUser;
        const newPassword = newPass.value;

    updatePassword(user, newPassword).then(() => {
        console.log("password updated")
        localStorage.setItem("password", newPass.value)
        }).catch((error) => {
    }); 
  }
    // let fullName = document.getElementById("name-profile");
    // let email = document.getElementById("email-profile");
    if (fileInput.files[0]) {
      const imageUrl = await uploadFile(fileInput.files[0]);
      const washingtonRef = doc(db, "users", uid);
      await updateDoc(washingtonRef, {
        name: changeName.value,
        picture: imageUrl,
      });
      console.log(userProfile)
    } else {
      const washingtonRef = doc(db, "users", uid);
      await updateDoc(washingtonRef, {
        name: changeName.value,
      }); 
    }
    Swal.fire({
      icon: "success",
      title: "User updated successfully",
    });
  });
  const uid = localStorage.getItem("uid");
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    if (location.pathname === "/profile.html") {
      console.log(docSnap.data().name + "  " + docSnap.data().email);
      changeName.value = docSnap.data().name;
      if (docSnap.data().picture != undefined) {
        userProfile.src = docSnap.data().picture;
      }
    } else if (docSnap.data().picture == "") {
      changeName.innerHTML = docSnap.data().name;
      if (docSnap.data().picture) {
        userProfile.src = docSnap.data().picture;
      }
    }
  } else {
    // docSnap.data() will be undefined in this case
    console.log();
}


