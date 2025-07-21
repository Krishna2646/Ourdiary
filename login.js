// Import Firebase core and auth modules (for CDN usage)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDZ9kJRl4lSbEziI17kEjOUyrD3m8PaKv4",
  authDomain: "ourdiary-364.firebaseapp.com",
  projectId: "ourdiary-364",
  storageBucket: "ourdiary-364.firebasestorage.app",
  messagingSenderId: "438409629525",
  appId: "1:438409629525:web:a85d1a2bc27d92f2f169dc",
  measurementId: "G-N9S6JHLGSB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const Githubprovider = new GithubAuthProvider();

// Google Sign-In
window.signInWithGoogle = function (event) {
  if (event) event.preventDefault(); // <-- Add this line
  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' }); // Always show account chooser
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;
      alert(`Logged in with Google: ${user.displayName}`);
      window.location.href = "Profile.html";
    })
    .catch((error) => {
      console.error("Google Sign-in Error:", error);
      alert("Google login failed. Try again.");
    });
};

// GitHub Sign-In
window.signInWithGithub = function (event) {
  if (event) event.preventDefault(); // <-- Add this line
  const githubProvider = new GithubAuthProvider();
  signInWithPopup(auth, githubProvider)
    .then((result) => {
      const user = result.user;
      alert(`Logged in with GitHub: ${user.displayName || user.email}`);
      window.location.href = "Profile.html";
    })
    .catch((error) => {
      console.error("GitHub Sign-in Error:", error);
      alert("GitHub login failed. Try again.");
    });
};

// Toggle Login/Signup Forms
window.toggleForms = function () {
  const login = document.getElementById('login-form');
  const signup = document.getElementById('signup-form');
  login.classList.toggle('hidden');
  signup.classList.toggle('hidden');
};

// Handle Email/Password Login
document.getElementById('login-btn').addEventListener('click', () => {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) {
    alert("Please fill in all fields");
    return;
  }
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert(`Logged in: ${user.email}`);
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error("Login error:", error);
      alert("Incorrect email or password.");
    });
});

// Handle Signup
document.getElementById('signup-btn').addEventListener('click', () => {
  const name = document.getElementById('signup-name').value.trim();
  const mobile = document.getElementById('signup-mobile').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  if (!name || !mobile || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      sendEmailVerification(user).then(() => {
        alert("Verification email sent! Please check your inbox.");
      });
      alert(`Account created for ${name}`);
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error("Signup error:", error);
      alert("Signup failed. Try again.");
    });
});

// Get elements for avatar/profile
const avatarOverlay = document.getElementById('avatarOverlay');
const avatarGrid = document.getElementById('avatarGrid');
const previewImg = document.getElementById('preview');
const profilePreview = document.getElementById('profilePreview');
const previewName = document.getElementById('previewName');
const previewBio = document.getElementById('previewBio');

// Avatar files
const avatarFiles = [
  'Ava.png',
  'Berner.png',
  'Cathy.png',
  'Ethan.png',
  'Kevin.png',
  'Lana.png',
  'Liam.png',
  'Mervin.png',
  'Olivia.png',
  'Ram.png',
  'sophie.png',
  'sopia.png'
];

// Selected avatar
let selectedAvatar = '';

// Function to create avatar grid items
function createAvatarGridItems() {
  avatarFiles.forEach(filename => {
    const url = `Avatars/${filename}`;
    const div = document.createElement('div');
    div.classList.add('avatar-item');
    div.innerHTML = `<div style="background-image: url('${url}');" onclick="selectAvatar(this, '${url}')"></div>`;
    avatarGrid.appendChild(div);
  });
}

// Function to open avatar selector
window.openAvatarSelector = function () {
  avatarOverlay.style.display = 'flex';
}

// Function to close avatar selector
window.closeAvatarSelector = function () {
  avatarOverlay.style.display = 'none';
}

// Function to handle overlay click
window.handleOverlayClick = function (event) {
  if (event.target === avatarOverlay) closeAvatarSelector();
}

// Function to select avatar
window.selectAvatar = function (elem, url) {
  document.querySelectorAll('.avatar-item').forEach(item => item.classList.remove('selected'));
  elem.parentElement.classList.add('selected');
  selectedAvatar = url;
}

// Function to confirm avatar selection
window.confirmAvatarSelection = function () {
  if (selectedAvatar) {
    previewImg.src = selectedAvatar;
    profilePreview.style.display = 'flex';
    previewName.textContent = document.getElementById('displayName').value;
    previewBio.textContent = document.getElementById('bio').value;
    closeAvatarSelector();
  }
}

// Function to handle file upload
window.handleFileUpload = function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      selectedAvatar = e.target.result;
      profilePreview.style.display = 'flex';
      previewName.textContent = document.getElementById('displayName').value;
      previewBio.textContent = document.getElementById('bio').value;
    }
    reader.readAsDataURL(file);
  }
}

// Function to submit profile
window.submitProfile = function () {
  const name = document.getElementById('displayName').value.trim();
  const bio = document.getElementById('bio').value.trim();
  if (!name || !selectedAvatar) {
    alert('Please enter a display name and select or upload an image.');
    return;
  }
  alert(`Profile created successfully!\n\nName: ${name}\nBio: ${bio}`);
}

// Event listeners
document.addEventListener('DOMContentLoaded', createAvatarGridItems);
document.addEventListener('keydown', function (e) {
  if (avatarOverlay.style.display === 'flex' && e.key === 'Enter') {
    e.preventDefault();
    confirmAvatarSelection();
  }
});

document.getElementById('displayName').addEventListener('input', () => {
  previewName.textContent = document.getElementById('displayName').value;
});

document.getElementById('bio').addEventListener('input', () => {
  const bioValue = document.getElementById('bio').value.trim();
  previewBio.textContent = bioValue || "(No bio provided)";
});

// Mobile optimization: instant select on mobile
window.selectAvatarMobile = function (elem, url) {
  selectAvatar(elem, url);
  if (window.innerWidth < 500) {
    setTimeout(() => {
      confirmAvatarSelection();
    }, 100);
  }
}

let isSigningIn = false;

document.getElementById('google-btn').addEventListener('click', () => {
  if (isSigningIn) return;
  isSigningIn = true;

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      alert(`Logged in with Google: ${user.displayName}`);
      window.location.href = "Profile.html";
    })
    .catch((error) => {
      console.error("Google Sign-in Error:", error.code, error.message);
      alert(`Google login failed: ${error.message}`);
    })
    .finally(() => {
      isSigningIn = false;
    });
});
window.resetPassword = function () {
  const email = document.getElementById('login-email').value.trim();

  if (!email) {
    alert("Please enter your email to reset your password.");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset email sent! Check your inbox.");
    })
    .catch((error) => {
      console.error("Reset error:", error.code, error.message);
      if (error.code === "auth/user-not-found") {
        alert("No account found with this email.");
      } else {
        alert("Failed to send password reset. Try again.");
      }
    });
};
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in:", user.email);
    // Optionally: redirect to dashboard if user already logged in
  } else {
    console.log("No user signed in");
  }
});
