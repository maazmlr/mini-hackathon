import { app,db,auth ,onAuthStateChanged} from "./firebase.js";
import {createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


var password = document.getElementById("password")
  , confirm_password = document.getElementById("repeat-password");

function validatePassword(){
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
  }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;




let reg_btn=document.querySelector(".reg-btn");
console.log(reg_btn)
reg_btn && reg_btn.addEventListener("click",(e)=>{
  e.preventDefault()
  let firstName=document.getElementById("firstName")
  let lastName=document.getElementById("lastName")
  let regname=firstName+" "+lastName;
  let reg_email=document.querySelector("#email");
  let reg_pass=document.querySelector("#password");
  createUserWithEmailAndPassword(auth, reg_email.value, reg_pass.value)
.then(async(userCredential) => {
  const user = userCredential.user;
  try{
  await setDoc(doc(db, "users", user.uid), {
      

      
      fullname: regname,
      email: reg_email.value,
      password: reg_pass.value
    });
     Swal.fire({
      icon: 'success',
      title: 'User Registered Successfully',
    })
    location.href='profile.html'
    localStorage.setItem("uid",user.uid)
    localStorage.setItem("password",reg_pass.value)

  }
  catch(error){
      console.log(error)

  }
})
.catch((error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
  // ..
  Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    })

});


});

onAuthStateChanged()