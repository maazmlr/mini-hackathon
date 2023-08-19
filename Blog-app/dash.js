import {app, db } from './firebase.js'
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,


} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

function formatAMPM(date) {
    let current = date.toJSON();
    let currentDate = current.slice(0, 10);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return `${currentDate}, ${strTime}`;
  }
  let path=".user,img"
  const addBtn = document.getElementById("add")
  const placeHold = document.getElementById("placeHold")
  addBtn?.addEventListener("click", async()=> {
    console.log("hhhh")
    try {
      let text = document.getElementById("msg");
      let textValue = text.value.trim();
      let da = formatAMPM(new Date());
      if (textValue == "" || placeHold.value == "") {
        alert("Please write some thing at text field");
      } else {
        const docRef = await addDoc(collection(db, "blogsValues"), {
          titel: placeHold.value,
          value: textValue,
          time: da,
        });
      }
    } catch (err) {
      console.log(err);
    }
  })


let arr = [];
const getTodos = () => {
  try{
  var text = document.getElementById("msg");
  var list = document.getElementById("list");
  let textValue = text.value.trim();
  onSnapshot(collection(db, "blogsValues"), (data) => {
    data.docChanges().forEach(async(change) => {
      arr.push(change.doc.id);
      if (change.type == "removed") {
        let d = document.getElementById(change.doc.id);
        d.remove();
      } else if (change.type == "added") {
        const uid = localStorage.getItem("uid");
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          list.insertAdjacentHTML(
            "afterbegin",
            `<li id="${change.doc.id}">
            <div class="mt-4 justify-content-center login-container">
                <div class="col-md-4">
                    <div class="card form" style="width: 70rem;">
                        <div class="card-body">
                                <div class="mb-3 blog">
                                    <div>
                                        <img id="blogProfile" src="${docSnap.data().picture}" alt="">
                                    </div>
                                    <div>
                                        <p id="blogPara">${change.doc.data().titel}</p>
                                        <div class="sub-blog">
                                            <p>${docSnap.data().name}</p>
                                            <p class="time">${change.doc.data().time}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3"> 
                                    <textarea placeholder="" id="msgBlog" cols="128" rows="5" disabled>${change.doc.data().value}</textarea>
                                </div>
                                <div class="buttonBlog">
                                    <button onclick='deleteBtn("${
                                      change.doc.id
                                    }")'>Delete</button>
                                    <button id="editBtn" onclick='editBtn(this,"${
                                      change.doc.id
                                    }")'>Edit</button>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </li>`
          );
        } else {
          // docSnap.data() will be undefined in this case
          console.log();
        }
      }
      text.value = "";
      placeHold.value = "";
    });
  });
}catch(e){

}
};
getTodos();

const deleteBtn = async (e) => {
  await deleteDoc(doc(db, "blogsValues", e));
};

var editVal = true;
const editBtn = async (e, id) => {
  var editImg = document.getElementById("editBtn");
  let msgBlog = document.getElementById("msgBlog")
  if (editVal) {
    editImg.innerHTML = "Update";
    msgBlog.disabled = false;
    editVal = false;
  } else {
    await updateDoc(doc(db, "blogsValues", id), {
      value: msgBlog.value,
    });
    editImg.innerHTML = "Edit";
    msgBlog.disabled = true;
    editVal = true;
  }
};

window.deleteBtn=deleteBtn
window.editBtn=editBtn