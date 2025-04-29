import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAsafO3Jjv_zjSexRPzNV5X81OF4pj7t-4',
  authDomain: 'my-todo-app-84f3c.firebaseapp.com',
  projectId: 'my-todo-app-84f3c',
  storageBucket: 'my-todo-app-84f3c.firebasestorage.app',
  messagingSenderId: '892171186673',
  appId: '1:892171186673:web:b2789218b41d5cc5561450',
  measurementId: 'G-771917CC5P'
};

const googleSignInBtn = document.getElementById('googleSignInBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginDiv = document.getElementById('loginDiv');
const userInfoDiv = document.getElementById('userInfoDiv');
const userImage = document.getElementById('userImage');
const userNameSpan = document.getElementById('userNameSpan');

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// connectAuthEmulator(auth, 'http://localhost:9099');

const loginEmailPassword = async () => {
  const email = 'hi@email.com';
  const password = 'password123';

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  console.log(userCredential.user);
};

// Google Sign-In
const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('Google sign-in successful:', result.user);
  } catch (error) {
    console.error('Google sign-in error:', error);
  }
};

const displayUserInfo = (user) => {
  loginDiv.style.display = 'none';
  userInfoDiv.style.display = 'block';

  const userName = user.displayName;
  const email = user.email || 'No email available';

  userImage.alt = userName;
  userNameSpan.innerHTML = userName;
};

const hideUserInfo = () => {
  loginDiv.style.display = 'block';
  userInfoDiv.style.display = 'none';
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is signed in:', user);
    console.log(user.displayName);
    displayUserInfo(user);
  } else {
    console.log('No user is signed in');
    hideUserInfo();
  }
});

const logout = async () => {
  try {
    await auth.signOut();
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

// test
googleSignInBtn.addEventListener('click', () => {
  loginWithGoogle();
});

logoutBtn.addEventListener('click', () => {
  logout();
});
// loginEmailPassword();
// loginWithGoogle();
// console.log('logged in with Google');
// await logout();
// console.log('logged out');

// signOut(auth)
//   .then(() => {
//     console.log('User signed out successfully');
//   })
//   .catch((error) => {
//     console.error('Error signing out:', error);
//   });
