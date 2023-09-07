import {
  auth,
  createUserWithEmailAndPassword,
  doc,
  setDoc,
  db /*CompleteSignUp */,
  signInWithEmailAndPassword,
  /* CheckState */ onAuthStateChanged,
} from "./firebase.js";
let nameInput = document.getElementById("name-input");
let email = document.getElementById("email-input");
let password = document.getElementById("password-input");
let signUpbtn = document.getElementById("sign-up");
let errorName = document.querySelector(".error-charactors");
signUpbtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (nameInput.value.length >= 4) {
    signUpbtn.innerHTML = `
   <span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
   <span class="visually-hidden" role="status">Loading...</span>
   `;
    nameInput.disabled = true;
    password.disabled = true;
    email.disabled = true;
    signUpbtn.disabled = true;
    nameInput.style.border = "none";
    errorName.style.display = "none";
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user.uid);
        await setDoc(doc(db, "users", user.uid), {
          name: nameInput.value,
          email: email.value,
          images:
            "https://tse1.mm.bing.net/th?id=OIP.tvaMwK3QuFxhTYg4PSNNVAHaHa&pid=Api&rs=1&c=1&qlt=95&w=107&h=107",
        });
        nameInput.disabled = false;
        password.disabled = false;
        email.disabled = false;
        signUpbtn.disabled = false;
        document.querySelector(".spinner-grow").style.display = "none";
        signUpbtn.innerHTML = `Sign up`;
        window.location.assign("index.html");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        swal("Oops", errorMessage, "error");
        nameInput.disabled = false;
        password.disabled = false;
        email.disabled = false;
        signUpbtn.disabled = false;
        document.querySelector(".spinner-grow").style.display = "none";
        signUpbtn.innerHTML = `Sign up`;
      });
  } else {
    nameInput.style.border = "2px solid red";
    errorName.style.display = "block";
  }
});

/*CompleteSignUp */

let loginBtn = document.querySelector(".login-btn");
const signIn = () => {
  let loginInputEmail = document.querySelector(".login-input-email");
  let loginInputPassword = document.querySelector(".login-input-password");
  loginBtn.innerHTML = `
<span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
<span class="visually-hidden" role="status">Loading...</span>
`;
  loginInputEmail.disabled = true;
  loginInputPassword.disabled = true;
  loginBtn.disabled = true;
  signInWithEmailAndPassword(
    auth,
    loginInputEmail.value,
    loginInputPassword.value,
  )
    .then((userCredential) => {
      const user = userCredential.user;
      loginInputEmail.disabled = false;
      loginInputPassword.disabled = false;
      loginBtn.disabled = false;
      let spinner = document.querySelector(".spinner-grow");
      spinner.style.display = "none";
      loginBtn.innerHTML = `
      LOG IN`;
      console.log("sing in");
      window.location.assign("index.html");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      swal("Oops", errorMessage, "error");
      loginInputEmail.disabled = false;
      loginInputPassword.disabled = false;
      loginBtn.disabled = false;
      let spinner = document.querySelector(".spinner-grow");
      spinner.style.display = "none";
      loginBtn.innerHTML = `
      LOG IN
      `;
    });
};
loginBtn.addEventListener("click", signIn);
/* Complete SignIn */

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    if (window.location.href !== "./index.html") {
      // window.location.assign('./index.html')
    }
    // ...
  } else {
    // User is signed out
    // ...
  }
});
