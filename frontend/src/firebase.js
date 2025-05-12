import { initializeApp } from 'firebase/app';
import { state, updateState, defaultState } from './state.js';
import { setMode, updateToDo } from './script.js';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

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
const logoutLoader = document.getElementById('logoutLoader');

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// connectAuthEmulator(auth, 'http://localhost:9099');

// Google Sign-In
const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('Google sign-in successful:', result.user);
    getUserInfoFromFirestore(result.user);
    displayUserInfo(result.user);
  } catch (error) {
    console.error('Google sign-in error:', error);
  }
};

const getUserInfoFromFirestore = async (user) => {
  const userId = user.uid;
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);
  // save logged out state
  // setLoggedOutState(state);

  if (userDoc.exists()) {
    console.log('User data:', userDoc.data());
    // replace state with userDoc.data() which was the state
    const userData = userDoc.data();
    updateState(userData);
    state.mode = 'work';
  } else {
    updateState(defaultState);
    console.log('No such document!');
  }
  // update localStorage with user data
  updateLocalStorage(state);

  // update state with localStorage
  updateToDo();
  setMode();
};

const updateLocalStorage = (userData) => {
  const localStorageKeys = Object.keys(localStorage);
  for (const key in userData) {
    if (localStorageKeys.includes(key)) {
      // if (userData.hasOwnProperty(key)) {
      try {
        localStorage.setItem(key, JSON.stringify(userData[key]));
      } catch (error) {
        console.error(`Error saving key "${key}" to localStorage:`, error);
      }
    }
  }
  console.log('User data saved to localStorage:', getLocalStorageAsJSON());
};

const getLocalStorageAsJSON = () => {
  // Convert localStorage to JSON - will be the same as state
  const json = {};
  const localStorageKeys = Object.keys(localStorage);
  localStorageKeys.forEach((key) => {
    try {
      json[key] = JSON.parse(localStorage.getItem(key));
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
    }
  });
  return json;
};

const saveUserInfoToFirestore = async (user) => {
  const userId = user.uid;
  const userDocRef = doc(db, 'users', userId);
  // const userData = getLocalStorageAsJSON();

  try {
    // save state to Firestore instead
    await setDoc(userDocRef, state); //{ merge: true } to update only
    console.log('User info saved to Firestore:', state); // userData);
  } catch (error) {
    console.error('Error saving user info to Firestore:', error);
  }

  // set state to loggedOutState
  updateState(defaultState);
  // reset localStorage to defaultLocalStorage
  updateLocalStorage(state);
  // update UI with state
  updateToDo();
  setMode();
  console.log('updated UI');
};

const displayUserInfo = (user) => {
  loginDiv.style.display = 'none';
  userInfoDiv.style.display = 'flex';

  const userName = user.displayName;

  userImage.alt = userName;
  userNameSpan.innerHTML = userName;
};

const hideUserInfo = () => {
  loginDiv.style.display = 'flex';
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
    await saveUserInfoToFirestore(auth.currentUser);
    console.log('User info saved to Firestore before sign out');
    await auth.signOut();
    console.log('User signed out successfully');
    hideUserInfo();
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

// test
googleSignInBtn.addEventListener('click', () => {
  loginWithGoogle();
});

logoutBtn.addEventListener('click', async () => {
  logoutLoader.style.display = 'inline-block';
  await logout();
  logoutLoader.style.display = 'none';
});
// loginEmailPassword();
// loginWithGoogle();
// console.log('logged in with Google');
// await logout();
// console.log('logged out');

// const loginEmailPassword = async () => {
//   const email = 'hi@email.com';
//   const password = 'password123';

//   const userCredential = await signInWithEmailAndPassword(
//     auth,
//     email,
//     password
//   );
//   console.log(userCredential.user);
// };

// signOut(auth)
//   .then(() => {
//     console.log('User signed out successfully');
//   })
//   .catch((error) => {
//     console.error('Error signing out:', error);
//   });
