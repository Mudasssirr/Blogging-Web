import {
    auth,
    onAuthStateChanged,
    doc,
    db,
    getDoc,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    storage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    updateDoc,
  } from "./firebase.js";
  let spinnerpic = document.querySelector(".loading");
  let cameraIcon = document.querySelector(".bi-camera-fill");
  let emailInput = document.querySelector(".email-input");
  let nameInput = document.querySelector(".name-input");
  let conformBtn = document.getElementById("update");
  let newPassword = document.getElementById("new-password");
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let propicture = document.querySelector(".pro-img");
        propicture.src = docSnap.data().images;
        emailInput.value = docSnap.data().email;
        nameInput.value = docSnap.data().name;
        let profileImg = document.querySelector("#fileInput");
        document.querySelector(".svg-frame").style.display = "none";
        document.querySelector(".contant-container").style.visibility = "inherit";
        profileImg &&
          profileImg.addEventListener("change", () => {
            console.log((profileImg.files.name = `${docSnap.data().name}.png`));
  
            if (
              profileImg.files[0].type == "image/png" ||
              profileImg.files[0].type == "image/jpeg"
            ) {
              const mountainImagesRef = ref(
                storage,
                (profileImg.files.name = `${docSnap.data().name}.png`),
              );
  
              const uploadTask = uploadBytesResumable(
                mountainImagesRef,
                profileImg.files[0],
              );
  
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  spinnerpic.style.display = "flex";
                  cameraIcon.style.display = "none";
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
                  console.log(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then(
                    async (downloadURL) => {
                      console.log("File available at", downloadURL);
                      const washingtonRef = doc(db, "users", user.uid);
                      await updateDoc(washingtonRef, {
                        images: downloadURL,
                      });
                      propicture.src = URL.createObjectURL(profileImg.files[0]);
                      spinnerpic.style.display = "none";
                      cameraIcon.style.display = "block";
                    },
                  );
                },
              );
            } else {
              swal("Oops", "Rong picture", "error");
            }
          });
      } else {
        console.log("No such document!");
      }
  
      let updateFun = async () => {
        let newEmail = document.querySelector(".email-input");
        let emailUpdation = () => {
          if (user.email != newEmail.value || newPassword.value !== "") {
            swal({
              content: {
                element: "input",
                attributes: {
                  placeholder: "Type your password",
                  type: "password",
                },
              },
            }).then(async (value) => {
              if (value) {
                try {
                  const user = auth.currentUser;
                  const credential = EmailAuthProvider.credential(
                    user.email,
                    value,
                  );
                  conformBtn.innerHTML = `
                                  <span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
                                  <span class="visually-hidden" role="status">Loading...</span>
                                  `;
                  emailInput.disabled = true;
                  nameInput.disabled = true;
                  conformBtn.disabled = true;
                  newPassword.disabled = true;
  
                  await reauthenticateWithCredential(user, credential);
                  await updateEmail(user, newEmail.value);
                  await updatePassword(user, newPassword.value);
                  const washingtonRef = doc(db, "users", user.uid);
                  await updateDoc(washingtonRef, {
                    email: newEmail.value,
                  });
                  swal({
                    icon: "success",
                  });
                  emailInput.disabled = false;
                  nameInput.disabled = false;
                  conformBtn.disabled = false;
                  newPassword.disabled = false;
                  conformBtn.innerHTML = `Conform!`;
                  newEmail.style.border = "none";
                } catch (error) {
                  const errorMessage = error.message;
                  conformBtn.innerHTML = "Conform!";
                  emailInput.disabled = false;
                  nameInput.disabled = false;
                  conformBtn.disabled = false;
                  newPassword.disabled = false;
  
                  console.log(errorMessage);
                  swal("Oops", errorMessage, "error").then(() => {
                    if (
                      errorMessage == "Firebase: Error (auth/wrong-password)."
                    ) {
                      newEmail.style.border = "none";
                      emailUpdation();
                    } else {
                      newEmail.style.border = "2px solid red";
                    }
                  });
                }
              } else {
                console.log("No input provided");
              }
            });
          }
        };
        emailUpdation();
        console.log();
        if (
          nameInput.value.length >= 4 &&
          nameInput.value !== docSnap.data().name
        ) {
          conformBtn.innerHTML = `
                  <span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
                  <span class="visually-hidden" role="status">Loading...</span>
                  `;
          document.querySelector(".error-name").style.display = "none";
          nameInput.style.border = "none";
          emailInput.disabled = true;
          nameInput.disabled = true;
          conformBtn.disabled = true;
          newPassword.disabled = true;
  
          const washingtonRef = doc(db, "users", user.uid);
          await updateDoc(washingtonRef, {
            name: nameInput.value,
          });
          if (docSnap.data().email == emailInput.value) {
            swal({
              icon: "success",
            });
          }
          emailInput.disabled = false;
          nameInput.disabled = false;
          conformBtn.disabled = false;
          newPassword.disabled = false;
          conformBtn.innerHTML = `Conform!`;
        }
        if (nameInput.value.length <= 5) {
          document.querySelector(".error-name").style.display = "block";
          nameInput.style.border = "2px solid red";
        }
      };
      conformBtn.addEventListener("click", updateFun);
    } else {
      console.log("sign out");
    }
  });
  