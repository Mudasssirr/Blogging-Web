import {
  auth,
  onAuthStateChanged,
  doc,
  db,
  getDoc,
  signOut,
  addDoc,
  collection,
  getDocs
} from "./firebase.js";

let userProfileBtn = document.getElementById("user-name");
let lofOutBtn = document.getElementById("log-out-btn");
let nameBtn = document.querySelector(".name-btn");
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      userProfileBtn.textContent = docSnap.data().name;
      lofOutBtn.innerHTML = console.log(userProfileBtn);
      lofOutBtn.innerHTML = `
        <div class="login-btn log-out-btn" id="login-btn">
                        LOG OUT
                    </div>
        `;
      let logOutBtn = document.querySelector(".log-out-btn");
      logOutBtn.addEventListener("click", () => {
        signOut(auth)
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {
            console.log(error);
          });
      });


      let postBtn = async () => {
        if(titleInput.value.trim() && textArea.value.trim()){
        const docRef = await addDoc(collection(db, "blogs"), {
          title: titleInput.value,
          descript: textArea.value,
          name: docSnap.data().name,
          image: docSnap.data().images
        });
        titleInput.value = "";
        textArea.value = "";
      allblogsGet()
        console.log("Document written with ID: ", docRef.id);

      }
      else{
        swal("Oops", "Please fill out this filed", "error");
      }
      }
      let postButton = document.querySelector(".post-btn");
      postButton.addEventListener("click", postBtn)


    } else {
      userProfileBtn.style.display = "none";
      console.log("No such document!");
    }
  } else {
    nameBtn.style.display = "none";
    console.log("sign out");
    document.querySelector("#all-post-container").style.marginTop = "79px"
    document.querySelector(".post-container").style.display = "none"
  }
});
let profileBtn = () => {
  window.location.assign("profile.html");
};
nameBtn.addEventListener("click", profileBtn);
let titleInput = document.querySelector(".title-input");
let textArea = document.querySelector(".text-erea");

const loader = document.getElementById("loader");

function showLoader() {
    loader.style.display = "flex";
}

function hideLoader() {
    loader.style.display = "none";
}


let allPostContainermain = document.getElementById("all-post-container");
let allblogsGet = async () => {
  showLoader();
  allPostContainermain.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "blogs"));
  querySnapshot.forEach((doc) => {
    allPostContainermain.innerHTML += `
<div class="get-data">
    <div class="post-get-container">
<div class="user-name-end-img">
    <img class="user-img" src="${doc.data().image}" alt="">
    <p class="user-name">${doc.data().name}</p>
    <div class='post-date'>
    ${moment(new Date(), "YYYYMMDD").fromNow()}
    </div>
</div>
<div class="contant">
<div class="title-container">
<p class="title-post">${doc.data().title}</p>
</div>
    <p class="blog-contant">${doc.data().descript}</p>
</div>
    </div>
</div>
 `;
  })
  hideLoader()
}
allblogsGet()

