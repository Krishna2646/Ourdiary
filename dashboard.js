import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDsPLXb3FjrluF1uD3P-2-_lVkefQ6bgew",
  authDomain: "clique-2k24.firebaseapp.com",
  projectId: "clique-2k24",
  storageBucket: "clique-2k24.firebasestorage.app",
  messagingSenderId: "850941754301",
  appId: "1:850941754301:web:ae780c3556ec38b53770d4",
  measurementId: "G-GFJWNG9C9C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Check auth
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadEntries(user.uid);
    document.getElementById("save-btn").addEventListener("click", () => saveEntry(user.uid));
  } else {
    alert("Not logged in");
    window.location.href = "login.html";
  }
});

// Save entry to Firestore
async function saveEntry(uid) {
  const content = document.getElementById("diary-entry").value.trim();
  const status = document.getElementById("entry-status");

  if (!content) {
    status.textContent = "Please write something.";
    status.style.color = "red";
    return;
  }

  try {
    await addDoc(collection(db, "entries"), {
      uid: uid,
      content: content,
      timestamp: new Date()
    });

    status.textContent = "Entry saved!";
    status.style.color = "green";
    document.getElementById("diary-entry").value = "";
    loadEntries(uid);
  } catch (e) {
    console.error("Error adding document: ", e);
    status.textContent = "Error saving entry.";
  }
}

// Load user's entries
async function loadEntries(uid) {
  const querySnapshot = await getDocs(collection(db, "entries"));
  const list = document.getElementById("entry-list");
  list.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.uid === uid) {
      const div = document.createElement("div");
      div.className = "entry";
      div.innerHTML = `
        <p>${data.content}</p>
        <div class="entry-actions">
          <button onclick="editEntry('${docSnap.id}', \${data.content.replace(//g, "\\")}\)">Edit</button>
          <button onclick="deleteEntry('${docSnap.id}')">Delete</button>
        </div>
      `;
      list.appendChild(div);
    }
  });
}

// Delete
window.deleteEntry = async function (id) {
  await deleteDoc(doc(db, "entries", id));
  loadEntries(auth.currentUser.uid);
};

// Edit
window.editEntry = async function (id, content) {
  const newText = prompt("Edit your entry:", content);
  if (newText) {
    await updateDoc(doc(db, "entries", id), {
      content: newText
    });
    loadEntries(auth.currentUser.uid);
  }
};