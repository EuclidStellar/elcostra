
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { set } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLU0brsnra4oCOiL0x0pxntVZzfdEMHrM",
  authDomain: "elcostra-f3111.firebaseapp.com",
  projectId: "elcostra-f3111",
  storageBucket: "elcostra-f3111.appspot.com",
  messagingSenderId: "379277385012",
  appId: "1:379277385012:web:c2d7340b8fbc55521bd961"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const dbRef = ref(database, '/members');

export async function getmember_names(){
  return get(dbRef).then((snapshot) => {
    if (snapshot.exists()) {
      return Object.keys(snapshot.val());
    } else {
      console.log("No data available");
      return [];
    }
  }).catch((error) => {
    console.error("Error fetching data:", error);
    return [];
  });
}

export async function getmember_data(memberFile){
  const memberRef = ref(database, `/members/${memberFile}`);
  return get(memberRef).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available for member:", memberFile);
      return {};
    }
  }).catch((error) => {
    console.error("Error fetching data for member:", error);
    return {};
  });
}

export async function add_member_to_fb(memberData) {
  console.log(memberData.id);
  const newMemberRef = ref(database, `/members/${memberData.name}`);
  set(newMemberRef, memberData).then(() => {
    console.log("Member added successfully");
  }).catch((error) => {
    console.error("Error adding member:", error);
  });
}