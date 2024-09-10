import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; 
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css"; 
import '../src/assets/style.css'


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbMCsRBZy8zJgGT3n9SFpREpE4QQehA00",
  authDomain: "vue-firebase-auth-9c4d5.firebaseapp.com",
  projectId: "vue-firebase-auth-9c4d5",
  storageBucket: "vue-firebase-auth-9c4d5.appspot.com",
  messagingSenderId: "407255936185",
  appId: "1:407255936185:web:098eeacc135ddc525f7f68"
};


const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp); 
const db = getFirestore(firebaseApp); 

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(Toast);
app.provide('auth', auth);
app.provide('db', db);
app.mount('#app');
